import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'odora_backend.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()
client = APIClient()

print("--- 1. Testing Health Check ---")
res = client.get('/api/v1/health/')
assert res.status_code == 200, f"Failed health check: {res.status_code}"
print("Health Check OK:", res.data)

print("\n--- 2. Testing Products List & Categories ---")
res = client.get('/api/v1/products/')
assert res.status_code == 200, f"Failed products list: {res.status_code}"
print(f"Found {res.data['count']} products.")

res = client.get('/api/v1/products/categories/')
assert res.status_code == 200, f"Failed categories list: {res.status_code}"
print(f"Found {len(res.data)} categories.")

print("\n--- 3. Testing Product Detail (Odora A316) ---")
res = client.get('/api/v1/products/odora-diffuser-a316/')
assert res.status_code == 200, f"Failed product detail: {res.status_code}"
diffuser = res.data
print(f"Product: {diffuser['name_ar']} - Price: {diffuser['final_price']} LYD")
print(f"Colorways: {[c['name_ar'] for c in diffuser['colorways']]}")
print(f"Coverage: {diffuser['coverage_area']} | Capacity: {diffuser['capacity']}")

print("\n--- 4. Testing Scent Notes on Fragrance Oil ---")
res = client.get('/api/v1/products/forest-sage-fragrance-oil/')
assert res.status_code == 200
oil = res.data
print(f"Oil: {oil['name_ar']} - Notes: {oil['scent_notes']['top_notes_ar']} -> {oil['scent_notes']['heart_notes_ar']} -> {oil['scent_notes']['base_notes_ar']}")

print("\n--- 5. Testing Guest Cart Flow ---")
client.credentials()  # clear any credentials
session_id = 'test-guest-session-12345'
client.defaults['HTTP_X_SESSION_ID'] = session_id

res = client.get('/api/v1/cart/')
assert res.status_code == 200
print("Initial Cart subtotal:", res.data['subtotal'])

# Add diffuser
res = client.post('/api/v1/cart/items/', {'product_id': diffuser['id'], 'quantity': 1}, format='json')
assert res.status_code == 200
print(f"Cart after adding diffuser: subtotal={res.data['subtotal']} LYD, delivery_fee={res.data['delivery_fee']} LYD, total={res.data['total_price']} LYD")

print("\n--- 6. Testing Coupon Validation ---")
res = client.post('/api/v1/marketing/coupons/validate/', {'code': 'ODORA10', 'subtotal': '320.00'}, format='json')
assert res.status_code == 200, f"Coupon validation failed: {res.data}"
print("Coupon Result:", res.data['message'], "| Discount:", res.data['discount_amount'])

print("\n--- 7. Testing Order Checkout (COD) ---")
checkout_payload = {
    'customer_name': 'محمد المحجوب',
    'customer_phone': '0912345678',
    'customer_email': 'mohammed@example.ly',
    'shipping_city': 'مصراتة',
    'shipping_address': 'شارع طرابلس، بالقرب من مجمع المحاكم',
    'payment_method': 'cod',
    'coupon_code': 'ODORA10',
}
res = client.post('/api/v1/orders/checkout/', checkout_payload, format='json')
assert res.status_code == 201, f"Checkout failed: {res.data}"
order = res.data
print(f"Order created successfully! Number: {order['order_number']}, Total: {order['total_amount']} LYD, Status: {order['status_display']}")

print("\n--- 8. Testing Order Tracking ---")
res = client.get(f"/api/v1/orders/track/{order['order_number']}/")
assert res.status_code == 200, f"Tracking failed: {res.status_code}"
print("Tracking details confirmed:", res.data['order_number'], res.data['status_logs'])

print("\n--- 9. Testing JWT Authentication & Admin Dashboard ---")
res = client.post('/api/v1/accounts/token/', {'email': 'admin@odora.ly', 'password': 'odora2026!'}, format='json')
assert res.status_code == 200, f"Admin login failed: {res.data}"
admin_token = res.data['access']
print("Admin login success. User is_staff:", res.data['user']['is_staff'])

client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')

res = client.get('/api/v1/analytics/dashboard/')
assert res.status_code == 200, f"Dashboard stats failed: {res.status_code}"
print("Dashboard Stats Overview:", res.data['overview'])
print("Top Products:", res.data['top_products'])

print("\n--- 10. Testing CRM Customers (Admin) ---")
res = client.get('/api/v1/crm/customers/')
assert res.status_code == 200, f"CRM customers failed: {res.status_code}"
print(f"CRM Customers count: {res.data['count']}")
for c in res.data['results']:
    print(f"- {c['name']} ({c['phone_number']}): {c['total_spent']} LYD - Tag: {c['tag_display']} - Origin: {c['origin_display']}")

print("\n>>> ALL 10 TESTS PASSED WITH 100% SUCCESS! <<<")
