import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/core/ui/buttons/custom_button.dart';

void main() {
  testWidgets('CustomButton displays text correctly', (WidgetTester tester) async {
    const buttonText = 'Click Me';
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: buttonText,
            onPressed: null,
          ),
        ),
      ),
    );

    expect(find.text(buttonText), findsOneWidget);
  });

  testWidgets('CustomButton shows loading indicator when isLoading is true',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Login',
            isLoading: true,
            onPressed: null,
          ),
        ),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('Login'), findsNothing);
  });

  testWidgets('CustomButton triggers onPressed when clicked',
      (WidgetTester tester) async {
    bool pressed = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Tap',
            onPressed: () => pressed = true,
          ),
        ),
      ),
    );

    await tester.tap(find.byType(CustomButton));
    await tester.pump();

    expect(pressed, isTrue);
  });
}
