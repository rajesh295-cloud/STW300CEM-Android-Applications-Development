
import 'package:flutter_test/flutter_test.dart';
import 'package:recan/http/httpuser.dart';

void main(){
  final HttpUser httpConn =  HttpUser();

  test('register' ,()async{
    var responce =  await httpConn.registerUser('flutter', 'devflutter@gmail.com', '1234567i');
      expect(responce , false);
  });
}
