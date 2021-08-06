from organizations.viewsets import OrganizationXViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('organizations', OrganizationXViewSet)
urlpatterns = router.urls