
import 'package:tencent_cloud_chat_sdk/tencent_im_sdk_plugin.dart';

class Utils {
  static Future<bool> getInitResult() async {
    try{
      final res = await TencentImSDKPlugin.v2TIMManager.checkAbility();
      if (res.code == 0) {
        return true;
      }
      print("Error: ${res.code} - ${res.desc}");
      return false;
    }catch(e){
      return false;
    }
  }
}
