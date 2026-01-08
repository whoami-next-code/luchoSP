import 'dart:io' show Platform;

import 'platform_types.dart';

class _PlatformInfoIo implements PlatformInfo {
  const _PlatformInfoIo();

  @override
  bool get isWeb => false;

  @override
  bool get isAndroid => Platform.isAndroid;
}

const PlatformInfo platformInfo = _PlatformInfoIo();

