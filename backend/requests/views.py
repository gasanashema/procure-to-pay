from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import PurchaseRequest
from .serializers import (
    PurchaseRequestSerializer, PurchaseRequestDetailSerializer,
    PurchaseRequestCreateSerializer, ApprovalActionSerializer,
    FileUploadSerializer
)
from .permissions import IsStaff, IsApprover, IsOwnerOrReadOnly, CanApproveRequest
from finance.permissions import IsFinanceUser
from documents.services import extract


class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_serializer_class(self):
        if self.action == 'create':
            return PurchaseRequestCreateSerializer
        elif self.action == 'retrieve':
            return PurchaseRequestDetailSerializer
        return PurchaseRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsStaff()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsStaff()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'staff':
            return PurchaseRequest.objects.filter(created_by=user)
        elif user.role in ['approver_1', 'approver_2']:
            # Return requests that this approver can act on
            return PurchaseRequest.objects.filter(status='pending')
        elif user.role == 'finance':
            return PurchaseRequest.objects.filter(status='approved')
        return PurchaseRequest.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsStaff])
    def upload_proforma(self, request, pk=None):
        obj = self.get_object()
        if obj.status != 'pending':
            return Response({'error': 'Cannot upload to non-pending request'}, status=400)

        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            obj.proforma_file = serializer.validated_data['file']
            obj.save()

            # Extract data from proforma
            extracted_data = extract.extract_proforma_data(obj.proforma_file.path)
            # TODO: Store extracted data

            return Response({'message': 'Proforma uploaded successfully'})
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsFinanceUser])
    def upload_receipt(self, request, pk=None):
        obj = self.get_object()
        if obj.status != 'approved':
            return Response({'error': 'Cannot upload receipt to non-approved request'}, status=400)

        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            obj.receipt_file = serializer.validated_data['file']
            obj.save()
            return Response({'message': 'Receipt uploaded successfully'})
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanApproveRequest])
    def approve(self, request, pk=None):
        obj = self.get_object()
        serializer = ApprovalActionSerializer(data=request.data)
        if serializer.is_valid():
            comments = serializer.validated_data.get('comments', '')
            obj.approve(request.user, comments)
            return Response({'message': 'Request approved'})
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, CanApproveRequest])
    def reject(self, request, pk=None):
        obj = self.get_object()
        serializer = ApprovalActionSerializer(data=request.data)
        if serializer.is_valid():
            comments = serializer.validated_data.get('comments', '')
            obj.reject(request.user, comments)
            return Response({'message': 'Request rejected'})
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsApprover])
def pending_approvals(request):
    user = request.user
    requests = PurchaseRequest.objects.filter(status='pending')

    # Filter based on approval level
    if user.role == 'approver_1':
        # Can approve if no level 1 approval exists
        requests = [r for r in requests if not r.approvals.filter(level=1).exists()]
    elif user.role == 'approver_2':
        # Can approve if level 1 is approved but level 2 is not
        requests = [r for r in requests if
                   r.approvals.filter(level=1, status='approved').exists() and
                   not r.approvals.filter(level=2).exists()]

    serializer = PurchaseRequestSerializer(requests, many=True)
    return Response(serializer.data)