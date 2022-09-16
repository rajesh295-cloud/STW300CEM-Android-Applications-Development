import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:page_transition/page_transition.dart';
import 'package:recan/http/httpuser.dart';
import 'package:recan/wearos/recandashboard.dart';


class WLogin extends StatefulWidget {
  const WLogin({Key? key}) : super(key: key);

  @override
  _WLoginState createState() => _WLoginState();
}

class _WLoginState extends State<WLogin> {
  // var title = "RECANAPP";
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String password = '';
// login user
  Future<bool> login(String email, String password) async {
    var response = HttpUser().loginUser(email, password);
    return response;
  }

//notification
  void notify() async {
    await AwesomeNotifications().createNotification(
      content: NotificationContent(
          id: 1,
          channelKey: 'key1',
          title: 'Logged in Successfully',
          body: 'Recan For You',
          notificationLayout: NotificationLayout.BigPicture,
          bigPicture:
              'https://images.idgesg.net/images/article/2019/01/android-q-notification-inbox-100785464-large.jpg?auto=webp&quality=85,70'),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 252, 252, 252),
      body: SafeArea(
        child: SingleChildScrollView(
          // ignore: avoid_unnecessary_containers
          child: Container(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.only(left: 0, top: 20, bottom: 15),
                  child: const CircleAvatar(
                    backgroundColor: Color.fromARGB(143, 216, 221, 220),
                    radius: 50.0,
                    child: Icon(
                      Icons.energy_savings_leaf,
                      color: Color.fromARGB(255, 79, 216, 74),
                      size: 65.0,
                    ),
                  ),
                ),
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: TextFormField(
                          key: const ValueKey("email"),
                          onSaved: (val) {
                            email = val!;
                          },
                          validator: MultiValidator([
                            RequiredValidator(errorText: "Email Required"),
                            EmailValidator(errorText: "Invalid Email")
                          ]),
                          decoration: const InputDecoration(
                            fillColor: Color.fromARGB(255, 255, 255, 255),
                            filled: true,
                            labelText: "Email",
                            labelStyle: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Poppins'),
                            border: OutlineInputBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(40.0)),
                            ),
                            prefixIcon: Icon(
                              Icons.email,
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: TextFormField(
                          obscureText: true,
                          key: const ValueKey('password'),
                          onSaved: (val) {
                            password = val!;
                          },
                          validator: MultiValidator([
                            RequiredValidator(errorText: "Password Required")
                          ]),
                          decoration: const InputDecoration(
                            fillColor: Color.fromARGB(255, 255, 255, 255),
                            filled: true,
                            labelText: "Password",
                            labelStyle: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Poppins'),
                            border: OutlineInputBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(40.0)),
                            ),
                            prefixIcon: Icon(
                              MdiIcons.key,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 14.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: Text(
                      'Forgot Password?',
                      style:
                          TextStyle(color: Color.fromARGB(255, 13, 155, 238)),
                      textAlign: TextAlign.end,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20.0),
                  child: SizedBox(
                    child: Column(
                      children: [
                        ElevatedButton(
                          key: const ValueKey('login'),
                          style: ElevatedButton.styleFrom(
                            primary: const Color.fromARGB(213, 79, 216, 74),
                            // primary: Colors.blueGrey.shade800,
                            minimumSize: const Size(170, 52),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(5)),
                          ),
                          onPressed: () async {
                            if (_formKey.currentState!.validate()) {
                              _formKey.currentState!.save();
                              var res = await login(email, password);
                              if (res) {
                                notify();
                                // ignore: use_build_context_synchronously
                                Navigator.push(
                                    context,
                                    PageTransition(
                                        type: PageTransitionType
                                            .leftToRightWithFade,
                                        child: const wearosdashboard()));
                                // ignore: use_build_context_synchronously
                                MotionToast.success(
                                        description:
                                            const Text("Login success"))
                                    .show(context);
                              } else {
                                // ignore: use_build_context_synchronously
                                MotionToast.error(
                                        description: const Text("Login Failed"))
                                    .show(context);
                              }
                            }
                          },
                          child: const Text(
                            "Sign In",
                            style: TextStyle(fontSize: 18),
                          ),
                        ),
                        
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
