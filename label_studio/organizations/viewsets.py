from organizations.models import Organization
from organizations.serializers import OrganizationXSerializer
from rest_framework import viewsets

class OrganizationXViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationXSerializer