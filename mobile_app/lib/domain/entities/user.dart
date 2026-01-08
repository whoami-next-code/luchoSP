class User {
  const User({
    required this.id,
    required this.name,
    required this.role,
    required this.email,
  });

  final String id;
  final String name;
  final String role;
  final String email;

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id']?.toString() ?? '',
        name: (json['name'] ?? json['fullName'] ?? '').toString(),
        role: json['role'] ?? '',
        email: json['email'] ?? '',
      );
}

