import 'platform_types.dart';

class _PlatformInfoStub implements PlatformInfo {
  const _PlatformInfoStub();

  @override
  bool get isWeb => false;

  @override
  bool get isAndroid => false;
}

const PlatformInfo platformInfo = _PlatformInfoStub();

