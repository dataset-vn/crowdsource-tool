from organizations.serializers import OrganizationXSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import mixins
from rest_framework.permissions import AllowAny
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from organizations.models import Organization, OrganizationMember
from rest_framework import status
from django.http import Http404

class OrganizationChangeId(APIView):
    """
    Get, post an organization instance.
    """
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (AllowAny, )
    queryset = Organization.objects.all()
    serializer_class = OrganizationXSerializer

    def get(self, request, format=None):
        organizationchangeid = Organization.objects.all()
        organizationchangeidserializer = OrganizationXSerializer(organizationchangeid, many=True)
        return Response(organizationchangeidserializer.data)

    def post(self, request, format=None):
        organizationchangeidserializer = OrganizationXSerializer(data=request.data)
        if organizationchangeidserializer.is_valid():
            organizationchangeidserializer.save()
            return Response(organizationchangeidserializer.data, status=status.HTTP_201_CREATED)
        return Response(organizationchangeidserializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrganizationChangeIdDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (AllowAny,)
    queryset = Organization.objects.all()
    serializer_class = OrganizationXSerializer

    def get_object(self, pk):
        try:
            return Organization.objects.get(pk=pk)
        except Organization.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        organizationchangeid = self.get_object(pk)
        organizationchangeidserializer = OrganizationXSerializer(organizationchangeid)
        return Response(organizationchangeidserializer.data)

    def put(self, request, pk, format=None):
        organizationchangeid = self.get_object(pk)
        organizationchangeidserializer = OrganizationXSerializer(organizationchangeid, data=request.data)
        if organizationchangeidserializer.is_valid():
            organizationchangeidserializer.save()
            return Response(organizationchangeidserializer.data)
        return Response(organizationchangeidserializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        organizationchangeid = self.get_object(pk)
        organizationchangeid.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
