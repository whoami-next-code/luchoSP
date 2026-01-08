import 'package:flutter/material.dart';

class SkeletonLoader extends StatelessWidget {
  const SkeletonLoader({
    super.key,
    this.height = 20,
    this.width = double.infinity,
    this.borderRadius = 8,
  });

  final double height;
  final double width;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
        color: Colors.grey.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(borderRadius),
      ),
    );
  }
}

class CotizacionSkeletonCard extends StatelessWidget {
  const CotizacionSkeletonCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const SkeletonLoader(width: 100, height: 20),
                const Spacer(),
                const SkeletonLoader(width: 80, height: 24, borderRadius: 20),
              ],
            ),
            const SizedBox(height: 12),
            const SkeletonLoader(width: 150, height: 16),
            const SizedBox(height: 8),
            const SkeletonLoader(width: 200, height: 16),
            const SizedBox(height: 12),
            const Row(
              children: [
                 SkeletonLoader(width: 100, height: 16),
                 Spacer(),
                 SkeletonLoader(width: 80, height: 16),
              ],
            )
          ],
        ),
      ),
    );
  }
}
