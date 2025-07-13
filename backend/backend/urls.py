from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API routes
    path('api/', include('api.urls')),  # All API endpoints from your app

    # Optional: browsable API login/logout views
    path('api-auth/', include('rest_framework.urls')),  # Note: only for DRF's browsable UI
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
