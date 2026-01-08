class CotizacionesFilter {
  final String? status;
  final DateTime? startDate;
  final DateTime? endDate;
  final double? minAmount;
  final double? maxAmount;
  final String? searchQuery;

  CotizacionesFilter({
    this.status,
    this.startDate,
    this.endDate,
    this.minAmount,
    this.maxAmount,
    this.searchQuery,
  });

  CotizacionesFilter copyWith({
    String? status,
    DateTime? startDate,
    DateTime? endDate,
    double? minAmount,
    double? maxAmount,
    String? searchQuery,
  }) {
    return CotizacionesFilter(
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      minAmount: minAmount ?? this.minAmount,
      maxAmount: maxAmount ?? this.maxAmount,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'status': status,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'minAmount': minAmount,
      'maxAmount': maxAmount,
      'searchQuery': searchQuery,
    };
  }

  factory CotizacionesFilter.fromJson(Map<String, dynamic> json) {
    return CotizacionesFilter(
      status: json['status'],
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      minAmount: (json['minAmount'] as num?)?.toDouble(),
      maxAmount: (json['maxAmount'] as num?)?.toDouble(),
      searchQuery: json['searchQuery'],
    );
  }

  Map<String, dynamic> toQueryParameters() {
    final params = <String, dynamic>{};
    if (status != null && status!.isNotEmpty) params['status'] = status;
    if (startDate != null) params['startDate'] = startDate!.toIso8601String();
    if (endDate != null) params['endDate'] = endDate!.toIso8601String();
    if (minAmount != null) params['minAmount'] = minAmount;
    if (maxAmount != null) params['maxAmount'] = maxAmount;
    if (searchQuery != null && searchQuery!.isNotEmpty) params['search'] = searchQuery;
    return params;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
  
    return other is CotizacionesFilter &&
      other.status == status &&
      other.startDate == startDate &&
      other.endDate == endDate &&
      other.minAmount == minAmount &&
      other.maxAmount == maxAmount &&
      other.searchQuery == searchQuery;
  }

  @override
  int get hashCode {
    return status.hashCode ^
      startDate.hashCode ^
      endDate.hashCode ^
      minAmount.hashCode ^
      maxAmount.hashCode ^
      searchQuery.hashCode;
  }
}
