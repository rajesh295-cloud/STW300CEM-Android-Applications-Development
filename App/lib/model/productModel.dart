
// ignore: file_names
import 'package:json_annotation/json_annotation.dart';
part 'productModel.g.dart';
@JsonSerializable()
class Productmodel {
  @JsonKey(name:'_id')
  String? id;
  String? title;
  String? catagory;
  String? description;
  String? image;
  String? date; 
  int? price;

  Productmodel({this.id, this.title, this.catagory, this.description, this.image});

  factory Productmodel.fromJson(Map<String,dynamic> obj)=> _$ProductmodelFromJson(obj);
  Map<String,dynamic> toJson()=> _$ProductmodelToJson(this);
}
