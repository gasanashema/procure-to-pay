from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from requests.models import PurchaseRequest
from .serializers import PurchaseOrderSerializer, ReceiptValidationSerializer
from .permissions import IsFinanceUser
from documents.services import receipt_validation


class FinanceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsFinanceUser]

    @action(detail=False, methods=['get'])
    def approved_requests(self, request):
        requests = PurchaseRequest.objects.filter(status='approved')
        serializer = PurchaseOrderSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def purchase_orders(self, request):
        requests = PurchaseRequest.objects.filter(
            status='approved'
        ).exclude(purchase_order_file='')
        serializer = PurchaseOrderSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def validate_receipt(self, request, pk=None):
        try:
            purchase_request = PurchaseRequest.objects.get(id=pk, status='approved')
        except PurchaseRequest.DoesNotExist:
            return Response({'error': 'Purchase request not found'}, status=404)

        serializer = ReceiptValidationSerializer(data=request.data)
        if serializer.is_valid():
            # Validate receipt
            result = receipt_validation.validate_receipt(
                serializer.validated_data['receipt_file'],
                purchase_request
            )
            return Response(result)
        return Response(serializer.errors, status=400)