class CotizacionesStats {
  final int total;
  final int pending;
  final int inProcess;
  final int completed;
  final int assignedToUser;
  final int userReportsCount;

  const CotizacionesStats({
    this.total = 0,
    this.pending = 0,
    this.inProcess = 0,
    this.completed = 0,
    this.assignedToUser = 0,
    this.userReportsCount = 0,
  });

  factory CotizacionesStats.fromJson(Map<String, dynamic> json) {
    return CotizacionesStats(
      total: json['total'] as int? ?? 0,
      pending: json['pending'] as int? ?? 0,
      inProcess: json['inProcess'] as int? ?? 0,
      completed: json['completed'] as int? ?? 0,
      assignedToUser: json['assignedToUser'] as int? ?? 0,
      userReportsCount: json['userReportsCount'] as int? ?? 0,
    );
  }
}
