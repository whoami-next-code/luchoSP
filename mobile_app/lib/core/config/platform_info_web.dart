import 'platform_types.dart';

class _PlatformInfoWeb implements PlatformInfo {
  const _PlatformInfoWeb();

  @override
  bool get isWeb => true;

  @override
  bool get isAndroid => false;
}

const PlatformInfo platformInfo = _PlatformInfoWeb();

