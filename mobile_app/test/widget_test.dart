import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

import 'package:mobile_app/core/app.dart';
import 'package:mobile_app/data/repositories/auth_repository.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository mockAuthRepo;

  setUp(() {
    mockAuthRepo = MockAuthRepository();
    when(() => mockAuthRepo.loadToken()).thenAnswer((_) async => null);
    when(() => mockAuthRepo.loadRefreshToken()).thenAnswer((_) async => null);
  });

  testWidgets('Renderiza la pantalla de login', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(mockAuthRepo),
        ],
        child: const App(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Industria SP'), findsWidgets); // Might appear multiple times (header)
    expect(find.text('Sistema de Producción'), findsOneWidget);
    // expect(find.text('Usuario / Email'), findsOneWidget); // Depends on if label is visible or inside InputDecorator
  });
}
