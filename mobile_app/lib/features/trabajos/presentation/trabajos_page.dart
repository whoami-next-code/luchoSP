import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/debug/debug_logger.dart';
import '../../../core/ui/layout/responsive_layout.dart';
import '../../auth/providers/auth_providers.dart';
import '../providers/trabajos_providers.dart';
import 'widgets/trabajo_card.dart';

class TrabajosPage extends ConsumerWidget {
  const TrabajosPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trabajosAsync = ref.watch(trabajosAsignadosProvider);

    // #region agent log
    debugLog(
      location: 'trabajos_page.dart:build',
      message: 'trabajos_build_render',
      data: {'stateType': '${trabajosAsync.runtimeType}'},
      hypothesisId: 'H3',
      runId: 'pre-fix-2',
    );
    // #endregion

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Trabajos'),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authControllerProvider.notifier).logout();
              if (context.mounted) {
                context.go('/login');
              }
            },
            tooltip: 'Cerrar sesión',
          ),
        ],
      ),
      body: trabajosAsync.when(
        data: (trabajos) {
          if (trabajos.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.work_outline,
                    size: 80,
                    color: Theme.of(context).colorScheme.outline,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No hay trabajos asignados',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Los trabajos asignados aparecerán aquí',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                ],
              ),
            );
          }
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(trabajosAsignadosProvider);
            },
            child: ResponsiveLayout(
              mobile: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: trabajos.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final trabajo = trabajos[index];
                  return TrabajoCard(
                    trabajo: trabajo,
                    onTap: () => context.push('/cotizaciones/${trabajo.id}'),
                  );
                },
              ),
              tablet: GridView.builder(
                padding: const EdgeInsets.all(24),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.5,
                ),
                itemCount: trabajos.length,
                itemBuilder: (context, index) {
                  final trabajo = trabajos[index];
                  return TrabajoCard(
                    trabajo: trabajo,
                    onTap: () => context.push('/cotizaciones/${trabajo.id}'),
                  );
                },
              ),
              desktop: GridView.builder(
                padding: const EdgeInsets.all(32),
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 400,
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 24,
                  childAspectRatio: 1.5,
                ),
                itemCount: trabajos.length,
                itemBuilder: (context, index) {
                  final trabajo = trabajos[index];
                  return TrabajoCard(
                    trabajo: trabajo,
                    onTap: () => context.push('/cotizaciones/${trabajo.id}'),
                  );
                },
              ),
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline,
                    size: 64, color: Theme.of(context).colorScheme.error),
                const SizedBox(height: 16),
                Text(
                  'Error al cargar trabajos',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  e.toString(),
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () {
                    ref.invalidate(trabajosAsignadosProvider);
                  },
                  icon: const Icon(Icons.refresh),
                  label: const Text('Reintentar'),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/cotizaciones/nueva'),
        icon: const Icon(Icons.add),
        label: const Text('Nueva Cotización'),
      ),
    );
  }
}
