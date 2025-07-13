from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, generics
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User

from .models import Product, Order, Cart
from .serializers import ProductSerializer, OrderSerializer
from rest_framework.serializers import ModelSerializer

# ---------- Auth & User Registration ----------
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ---------- Products ----------
@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# ---------- Orders ----------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    product = Product.objects.get(id=request.data['product_id'])

    order = Order.objects.create(
        user=request.user,
        product=product,
        name=request.data['name'],
        email=request.data['email'],
        phone=request.data['phone'],
        address=request.data['address']
    )

    send_mail(
        subject='New Order Received',
        message=(
            f"Product: {product.name}\n"
            f"Customer: {order.name}\n"
            f"Email: {order.email}\n"
            f"Phone: {order.phone}\n"
            f"Address: {order.address}"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['aliytm57@gmail.com'],
        fail_silently=False,
    )

    return Response({'status': 'Order placed successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-id')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# ---------- Cart ----------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product = Product.objects.get(id=request.data['product_id'])
    Cart.objects.create(user=request.user, product=product)
    return Response({'status': 'Added to cart'})


# ---------- Test Endpoint ----------
@api_view(['GET'])
def hello(request):
    return Response({"message": "Hello from Django!"})
