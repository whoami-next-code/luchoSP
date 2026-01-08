class ParteTiempo {
  const ParteTiempo({
    required this.inicio,
    required this.fin,
    required this.totalMinutos,
  });

  final DateTime inicio;
  final DateTime fin;
  final int totalMinutos;

  Map<String, dynamic> toJson() => {
        'inicio': inicio.toIso8601String(),
        'fin': fin.toIso8601String(),
        'totalMinutos': totalMinutos,
      };
}

