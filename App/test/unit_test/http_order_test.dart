import 'package:flutter_test/flutter_test.dart';
import 'package:recan/http/productOrder.dart';

void main(){
  final Httporder httpConn =  Httporder();

String? orderid = '123456789098765443';
  test('order Test' ,()async{
     var res= await httpConn.order(orderid);
      expect(res , true);
  });
}