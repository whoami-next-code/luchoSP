class CotizacionItem {
  const CotizacionItem({
    required this.productId,
    required this.quantity,
    this.productName,
  });

  final int productId;
  final int quantity;
  final String? productName;

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'quantity': quantity,
        if (productName != null) 'productName': productName,
      };
}

class Cotizacion {
  const Cotizacion({
    required this.customerName,
    required this.need,
    required this.items,
    this.customerPhone,
    this.customerCompany,
    this.customerDocument,
    this.customerAddress,
    this.estimatedDate,
    this.estimatedDeliveryDate,
    this.budget,
    this.totalAmount,
    this.notes,
    this.preferredChannel,
  });

  final String customerName;
  final String need;
  final List<CotizacionItem> items;
  final String? customerPhone;
  final String? customerCompany;
  final String? customerDocument;
  final String? customerAddress;
  final String? estimatedDate;
  final String? estimatedDeliveryDate;
  final double? budget;
  final double? totalAmount;
  final String? notes;
  final String? preferredChannel;

  Map<String, dynamic> toJson() => {
        'customerName': customerName,
        'need': need,
        'items': items.map((item) => item.toJson()).toList(),
        if (customerPhone != null) 'customerPhone': customerPhone,
        if (customerCompany != null) 'customerCompany': customerCompany,
        if (customerDocument != null) 'customerDocument': customerDocument,
        if (customerAddress != null) 'customerAddress': customerAddress,
        if (estimatedDate != null) 'estimatedDate': estimatedDate,
        if (estimatedDeliveryDate != null)
          'estimatedDeliveryDate': estimatedDeliveryDate,
        if (budget != null) 'budget': budget,
        if (totalAmount != null) 'totalAmount': totalAmount,
        if (notes != null) 'notes': notes,
        if (preferredChannel != null) 'preferredChannel': preferredChannel,
      };
}

