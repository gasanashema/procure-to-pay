from rest_framework import serializers
from requests.models import PurchaseRequest


class PurchaseOrderSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = [
            'id', 'title', 'amount', 'created_by_name',
            'purchase_order_file', 'created_at'
        ]
        read_only_fields = ['id', 'title', 'amount', 'created_by_name', 'purchase_order_file', 'created_at']


class ReceiptValidationSerializer(serializers.Serializer):
    receipt_file = serializers.FileField()
    purchase_request_id = serializers.IntegerField()

    def validate_purchase_request_id(self, value):
        try:
            request = PurchaseRequest.objects.get(id=value, status='approved')
            return value
        except PurchaseRequest.DoesNotExist:
            raise serializers.ValidationError("Purchase request not found or not approved")