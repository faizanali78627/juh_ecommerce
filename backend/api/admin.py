from django.contrib import admin
from .models import Product, ProductMedia, Order, Cart

class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductMediaInline]

admin.site.register(Product, ProductAdmin)
admin.site.register(Order)
admin.site.register(Cart)
