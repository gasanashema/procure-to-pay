from rest_framework import serializers
from .models import PurchaseRequest, Approval, RequestItem


class RequestItemSerializer(serializers.ModelSerializer):
    total = serializers.ReadOnlyField()

    class Meta:
        model = RequestItem
        fields = ['id', 'item_name', 'price', 'quantity', 'total']


class ApprovalSerializer(serializers.ModelSerializer):
    approver_name = serializers.CharField(source='approver.get_full_name', read_only=True)
    approver_role = serializers.CharField(source='approver.role', read_only=True)

    class Meta:
        model = Approval
        fields = ['id', 'approver', 'approver_name', 'approver_role', 'level', 'status', 'comments', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class PurchaseRequestSerializer(serializers.ModelSerializer):
    items = RequestItemSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    approved_by_names = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseRequest
        fields = [
            'id', 'title', 'description', 'amount', 'status',
            'created_by', 'created_by_name', 'approved_by', 'approved_by_names',
            'proforma_file', 'receipt_file', 'purchase_order_file',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'approved_by', 'approved_by_names']

    def get_approved_by_names(self, obj):
        return [user.get_full_name() for user in obj.approved_by.all()]


class PurchaseRequestDetailSerializer(PurchaseRequestSerializer):
    approvals = ApprovalSerializer(many=True, read_only=True)

    class Meta(PurchaseRequestSerializer.Meta):
        fields = PurchaseRequestSerializer.Meta.fields + ['approvals']


class PurchaseRequestCreateSerializer(serializers.ModelSerializer):
    items = RequestItemSerializer(many=True, required=False)

    class Meta:
        model = PurchaseRequest
        fields = ['title', 'description', 'amount', 'proforma_file', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data['created_by'] = self.context['request'].user
        request = PurchaseRequest.objects.create(**validated_data)

        for item_data in items_data:
            RequestItem.objects.create(purchase_request=request, **item_data)

        return request


class ApprovalActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    comments = serializers.CharField(required=False, allow_blank=True)


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()