String.prototype.replaceAll = function(find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function callSweetMsg(json, title, etype) {
    swal({
        title: title,
        text: json.status,
        type: etype,
        allowOutsideClick: false,
        confirmButtonText: "Ok"
    });
}


function clearCode() {

    dopost({
        "type": "POST",
        "url": api_link + "/account.php",
        "data": {
            "accountid": queryString('accountid'),
            "action": "clearcode"
        },
        "success": function(response) {registerUser
            try {
                $.unblockUI('hide');
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    $(".success").show();
                    $(".all").show();
                } else {
                    $(".errorm").show();
                    $(".all").show();
                }

            } catch (e) {
                console.error(e.stack);
            }
        },
        "error": loadingerr
    });
}


function callSweetMsgNormal(title, msg, etype) {
    swal({
        title: title,
        html: msg,
        type: etype,
        allowOutsideClick: false,
        confirmButtonText: "Ok"
    });
}

function newQueryString(a) {
    var test = window.location.href;
    var findstr = (a + '=');
    if (test.indexOf(findstr) != -1) {
        test = test.substring(test.indexOf(findstr) + findstr.length);
        if (test.indexOf('&') != -1) {
            test = test.substring(0, test.indexOf('&'));
        }
        return decodeURIComponent(test);
    }
    return "";
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


function getProfilePhoto() {
    $(".upload_img").attr('src', 'php/api/get_image.php?userid=' + getItem('userid') + '');
}

// getProfilePhoto();

function findUnique(arr, key, cmpfld, cmpval) {
    var myarr = [];
    for (var idx in arr) {

        if (arr[idx][cmpfld] == cmpval) {
            myarr[myarr.length] = arr[idx];
        }
    }

    var result = [];
    var resultjson = {};
    for (var idx in myarr) {
        if (myarr[idx].hasOwnProperty(key)) {
            resultjson[myarr[idx][key]] = "";
        }
    }
    for (var idx in resultjson) {
        result[result.length] = idx;
    }
    /*arr.forEach(function (d) {
        if (result.indexOf(d) === -1)
            result.push(d);
    });*/
    result = result.sort();
    return result;
}


function readTextFile() {
    $("#textmodal").modal({
        show: true
    });
    var reader = new FileReader();
    reader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById('textfile').value = textFromFileLoaded;
    };
    reader.readAsText(fileToLoad, 'UTF-8');
}


function successfulMessage(json) {
    bootbox.dialog({
        message: json.status,
        title: "Project Name",
        buttons: {
            success: {
                label: "OK",
                className: "btn-primary btn-sm",
                callback: function() {}
            }

        }
    });
}

function login() {
    var userid = $('#email').val();
    var pwd = $('#password').val();
    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });
    if (userid != '' && pwd != '') {

        $.ajax({
            "url": "php/api/login.php",
            "data": {
                "userid": userid,
                "password": pwd
                    //                 "myaction": "Login"
            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        setItem("username", json.data.username);
                        setItem("userid", json.data.userid);
                        setItem("role", json.data.role);
                        setItem("email", json.data.email);
                        setItem("phone", json.data.phoneno);
                        setItem("fullname", json.data.fullname);
                        setItem("accountid", json.data.accountid);
                        setItem("sessionid", json.data.sessionid);

                        var rl = json.data.role;
                        if (json.data.role == 'customer')
                            window.location.href = "user_dashboard.html";
                        else if (json.data.role == 'admin')
                            window.location.href = "admin_dashboard.html";

                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    //$.mobile.loading('hide');
                    $.unblockUI();
                    console.log(e.message);
                    //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");

                }

            },
            "error": function(jqXHR, textStatus) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log("Login Error");
            }
        });
    } else {
        if (username == '' || pwd == '') {
            callSweetMsgNormal("Wells Center Trade", "Please enter your login parameters", "error");
        }

    }
}

function saveFinancialInfo() {
    var bitcoin_address = $('#btc').val();
    var etherum_address = $('#eth').val();
    var xrp_address = $('#xrp').val();
    var doge = $('#doge').val();
    var cardano = $('#cardano').val();
    var bcash = $('#bcash').val();
    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "bitcoin_address": bitcoin_address,
            "etherum_address": etherum_address,
            "xrp_address": xrp_address,
            "doge": doge,
            "cardano": cardano,
            "bcash": bcash,
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "add_financial_info"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    callSweetMsg(json, "Wells Center Trade", "success");
                    // window.location.href = ".html";
                } else {
                    callSweetMsg(json, "Wells Center Trade", "error");
                }

                $.unblockUI();
            } catch (e) {
                $.unblockUI();
                console.log(e.message);

            }

        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
            console.log("Login Error");
        }
    });
}



function getProfile() {


    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "get_profile"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    for (var idx in json.data) {
                        // $(".fullname").html(json.data[idx].fullname);
                        // $(".username").html(json.data[idx].username);
                        // $(".email").html(json.data[idx].email);
                        // $(".phone").html(json.data[idx].phoneno);
                        // $(".gender").html(json.data[idx].gender);
                        // $(".address").html(json.data[idx].address);

                        $("#fullname").val(json.data[idx].fullname);
                        $("#username").val(json.data[idx].username);
                        $("#email").val(json.data[idx].email);
                        $("#email1").val(json.data[idx].email);

                        $("#phone").val(json.data[idx].phoneno);
                        $("#address").val(json.data[idx].address);

                        $("#gender option:selected").val(json.data[idx].gender);
                        $("#gender option:selected").text(json.data[idx].gender);

                        // var host = 'www.'+window.location.host;

                        $(".ref_url").html("www.blechadaltd.com/admin/register.html?ref=" + json.data[idx].username);
                        $(".ref_url").attr("href", "register.html?ref=" + json.data[idx].username);
                    }

                } else {
                    callSweetMsg(json, "Wells Center Trade", "error");
                }

                $.unblockUI();
            } catch (e) {
                $.unblockUI();
                console.log(e.message);

            }

        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
            console.log("Login Error");
        }
    });
}


function resetPassword() {
    var email = $("#femail").val();

    if (email == '' || email == null) {
        callSweetMsgNormal("Wells Center Trade", "Enter Email Address", "error");
        return false;
    } else {
        $.blockUI({
            message: 'Loading',
            baseZ: 1000
        });
        $.ajax({
            "url": "php/api/general_page.php",
            "type": "POST",
            "data": {
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "email": email,
                "action": "reset_password"
            },
            "success": function(response) {
                try {
                    $.unblockUI('hide');
                    var json = JSON.parse(response);
                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                        // window.location.reload();
                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }
                } catch (e) {
                    console.error(e.stack);
                }
            },
            "error": loadingerr
        });
    }
}


function changePassword() {
    var email = $("#email1").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();


    if (cpassword!=password) {
        callSweetMsgNormal("Wells Center Trade", "Password did not match", "error");
        return false;
    } else {
        $.blockUI({
            message: 'Loading',
            baseZ: 1000
        });
        $.ajax({
            "url": "php/api/general_page.php",
            "type": "POST",
            "data": {
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "email": email,
                "password": password,
                "action": "change_password"
            },
            "success": function(response) {
                try {
                    $.unblockUI('hide');
                    var json = JSON.parse(response);
                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                        window.location.href = 'index.html';
                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }
                } catch (e) {
                    console.error(e.stack);
                }
            },
            "error": loadingerr
        });
    }
}



function changeUserPassword() {
    var email = $("#email1").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();


    if (cpassword!=password) {
        callSweetMsgNormal("Wells Center Trade", "Password did not match", "error");
        return false;
    } else {
        $.blockUI({
            message: 'Loading',
            baseZ: 1000
        });
        $.ajax({
            "url": "php/api/general_page.php",
            "type": "POST",
            "data": {
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "email": email,
                "password": password,
                "action": "change_password"
            },
            "success": function(response) {
                try {
                    $.unblockUI('hide');
                    var json = JSON.parse(response);
                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                       // window.location.href = 'index.html';
                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }
                } catch (e) {
                    console.error(e.stack);
                }
            },
            "error": loadingerr
        });
    }
}



function updateProfile() {
    var fullname = $('#fullname').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var address = $('#address').val();
    var gender = $('#gender option:selected').val();
    var phone = $('#phone').val();

    $.blockUI({
        message: 'Loading'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "fullname": fullname,
            "username": username,
            "password": password,
            "address": address,
            "gender": gender,
            "phone": phone,
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "update_account"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    callSweetMsg(json, "Wells Center Trade", "success");
                    getProfile();
                    // window.location.href = ".html";


                } else {
                    callSweetMsg(json, "Wells Center Trade", "error");
                }

                $.unblockUI();
            } catch (e) {
                $.unblockUI();
                console.log(e.message);

            }

        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
            console.log("Login Error");
        }
    });
}


function adminWallet(wallet_type) {
    $("#wallet_type").val(wallet_type);
    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "wallet_type": wallet_type,
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "get_admin_wallet"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    for (var idx in json.data) {
                        if (wallet_type == 1)
                            $("#owner_wallet").html(json.data[idx].bitcoin_address);
                        else if (wallet_type == 2)
                            $("#owner_wallet").html(json.data[idx].etherum_address);
                        else if (wallet_type == 3)
                            $("#owner_wallet").html(json.data[idx].xrp_address);
                        else if (wallet_type == 4)
                            $("#owner_wallet").html(json.data[idx].doge_address);
                        else if (wallet_type == 5)
                            $("#owner_wallet").html(json.data[idx].cardano_address);
                    }
                    var amount = $("#amount").val();
                    var percentX;
                    var result;
                    var plantype;
                    var plan_t;
                    if ($('input[name="plan_type"]:checked').val() == 'Trial Plan') {
                        plantype = "5% within 12 hours";
                        plan_t = 'Trial Plan';
                    }
                    if ($('input[name="plan_type"]:checked').val() == 'Promo Plan') {
                        plantype = '20% within 24 hours';
                        plan_t = 'Promo Plan';
                    }
                    if ($('input[name="plan_type"]:checked').val() == 'Special Package') {
                        plantype = '30% After 1 hour';
                        plan_t = 'Special Package'
                    }
                    if ($('input[name="plan_type"]:checked').val() == 'Expert Trade') {
                        plantype = '50% After 60 Minutes';
                        plan_t = 'Expert Trade'
                    }
                    // if ($('input[name="plan_type"]:checked').val() == 'Saving Zoid') {
                    //     plan_t = 'Saving Zoid'
                    //     plantype = '2.5% daily for 1 month';
                    // }

                    // console.log(amount);
                    // console.log(plantype);
                    // percentX = plantype;

                    function percentCalculation(a, b) {
                        var c = (parseFloat(a) * parseFloat(b)) / 100;
                        return parseFloat(c);
                    }

                    // result = percentCalculation(amount, percentX);

                    $("#planlbl").html(plan_t);
                    $("#profitlbl").html(plantype);
                    $("#amountlbl").attr("amount", $("#amount").val());
                    $("#amountlbl").html("$" + $("#amount").val());
                    $(".showctrl").show();
                    //  $("#overview_modal").modal();

                } else {
                    console.log("error");
                }

                $.unblockUI();
            } catch (e) {
                $.unblockUI();
                console.log(e.message);

            }

        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
            console.log("Login Error");
        }
    });
}


function depositAmount(extra=null) {
    var planlbl = $('#crypto_plan option:selected').val();
    var alias = $("#crypto_option option:selected").val();
    var profit;
    var amount = $('#amount').val();
    var wallet_type = $('#wallet_type').val();
    var referral_user = $("#referral_user").val();
    var wallet_address = $("#wallet_address").val();
    var email= $("#email_address").val();

    if (planlbl == 01) {
        profit = 8;
        if (amount < 150) {
            callSweetMsgNormal("Wells Center Trade", "Amount entered is below minimum amount for this plan: Minimum for this plan is <strong class='text-danger'>$150</strong>", "error");
            return false;
        }
    } else if (planlbl == 02) {
        profit = 16;
        if (amount < 2300) {
            callSweetMsgNormal("Wells Center Trade", "Amount entered is below minimum amount for this plan: Minimum for this plan is <strong class='text-danger'>$2300</strong>", "error");
            return false;
        }
    } else if (planlbl == 03) {
        profit = 20;
        if (amount < 3000) {
            callSweetMsgNormal("Wells Center Trade", "Amount entered is below minimum amount for this plan: Minimum for this plan is <strong class='text-danger'>$3000</strong>", "error");
            return false;
        }
    } 
    else if (planlbl == 04) {
        profit = 29.5;
        if (amount < 10000) {
            callSweetMsgNormal("Wells Center Trade", "Amount entered is below minimum amount for this plan: Minimum for this plan is <strong class='text-danger'>$10000</strong>", "error");
            return false;
        }
    }
    else if (planlbl == 05) {
        profit = 20;
        if (amount < 10000) {
            callSweetMsgNormal("Wells Center Trade", "Amount entered is below minimum amount for this plan: Minimum for this plan is <strong class='text-danger'>$10000</strong>", "error");
            return false;
        }
    }

    if (planlbl == '' || profit == '' || amount == '' || alias == '' || wallet_address == '') {
        callSweetMsgNormal("Wells Center Trade", "Some fields are missing", "error");
        return false;
    } else {
        $.blockUI({
            message: '<div class="spinner-grow" role="status"><span class="sr-only">Please wait...</span></div>'
        });

        $.ajax({
            "url": "php/api/general_page.php",
            "data": {
                "plan": planlbl,
                "profit": profit,
                "amount": amount,
                "wallet_type": wallet_type,
                "wallet_address": wallet_address,
                "email":email,
                "extra":extra,
                "role":getItem('role'),
                "wallet_alias": $("#crypto_option option:selected").val(),
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "action": "deposit_amount"

            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                        $('#overview_modal').remove();
                        $(".modal-bg").removeClass();
                        $(".modal-backdrop.show").css("display", "none");
                        window.location.reload();

                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    $.unblockUI();
                    console.log(e.message);

                }

            },
            "error": function(jqXHR, textStatus) {
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}


function addProfit(extra=null) {
    var profit = $('#profit').val();
    var transaction_id = $("#transaction_id").val();

    if (profit == '' || transaction_id == '') {
        callSweetMsgNormal("Wells Center Trade", "All fields are required", "error");
        return false;
    } else {
        $.blockUI({
            message: '<div class="spinner-grow" role="status"><span class="sr-only">Please wait...</span></div>'
        });

        $.ajax({
            "url": "php/api/general_page.php",
            "data": {
                "profit": profit,
                "transaction_id": transaction_id,
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "extra":extra,
                "action": "add_profit_to_account"
            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                        $('#overview_modal').remove();
                        $(".modal-bg").removeClass();
                        $(".modal-backdrop.show").css("display", "none");
                        window.location.reload();

                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    $.unblockUI();
                    console.log(e.message);

                }

            },
            "error": function(jqXHR, textStatus) {
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function userstats(act,extra=null) {

    $.ajax({
        "type": "POST",
        "url": "php/api/statistics.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "username": getItem('username'),
            "extra":extra,
            "action": act
        },
        "success": function(response) {
            try {
                $.unblockUI('hide');
                var json = JSON.parse(response);
                $(".wtt").hide();
                if (act == 'admin_stats') {
                    try {
                        if (json.total_investment[0].wallet_alias == 1)
                            $(".bitcoin_bal").html(formatter.format(json.total_investment[0].total));
                        else if (json.total_investment[0].wallet_alias == 2)
                            $(".eth_bal").html(formatter.format(json.total_investment[0].total));
                        else if (json.total_investment[0].wallet_alias == 5)
                            $(".cash_bal").html(formatter.format(json.total_investment[0].total));
                        else if (json.total_investment[0].wallet_alias == 3)
                            $(".xrp").html(formatter.format(json.total_investment[0].total));
                            
                        if (json.users[0].total == null || json.users[0].total == "")
                            $(".users").html("0");
                        else
                            $(".users").html(json.users[0].total);
                            
                        if (json.total_investment[0].total == null || json.total_investment[0].total == "")
                            $(".all_deposit").html("0");
                        else
                            $(".all_deposit").html(formatter.format(json.total_investment[0].total));

                          
                        if (json.total_trans[0].total == null || json.total_trans[0].total == "")
                            $(".total_trans").html("0");
                        else
                            $(".total_trans").html(json.total_trans[0].total);

                        if (json.settlement[0].total == null || json.settlement[0].total == "")
                            $(".settlement").html("0");
                        else {
                            $(".settlement").html(formatter.format(json.settlement[0].total));
                        }
                       
                       
                        if (json.withdraw[0].total == null || json.withdraw[0].total == "")
                            $(".withdraw").html("0");
                        else {
                            $(".withdraw").html(formatter.format(json.withdraw[0].total));
                        }
                    } catch (e) {

                    }
                } else {
     
                

                    if (json.invested[0].total == null || json.invested[0].total == "")
                    $(".invested").html("0");
                    else {
                        $(".invested").html(formatter.format(json.invested[0].total));
                    }

                    if (json.balance[0].wallet_alias == 1)
                        $(".bitcoin_bal").html(json.balance[0].total);
                    else if (json.balance[0].wallet_alias == 2)
                        $(".eth_bal").html(json.balance[0].total);
                    else if (json.balance[0].wallet_alias == 3)
                        $(".cash_bal").html(json.balance[0].total);

                    if (json.balance[0].total == null || json.balance[0].total == "")
                        $(".all_deposit").attr("data-odometer-final", "0");
                    else
                        $(".all_deposit").attr("data-odometer-final", json.balance[0].total);


                    if (json.referral[0].total == null || json.referral[0].total == "")
                        $(".referral_amount").html("0");
                    else
                        $(".referral_amount").html(formatter.format(json.referral[0].total));

                    if (json.balance[0].earnings == null || json.balance[0].earnings == "")
                        $(".balance2").html("0");
                    else {
                        $(".balance2").html(formatter.format(json.balance[0].earnings));
                    }

                    if (json.balance[0].total == null || json.balance[0].total == "")
                        $(".total_deposit").html("0");
                    else {

                        $(".total_deposit").html(formatter.format(json.balance[0].total));
                    }
                    if (json.balance[0].earnings == null || json.balance[0].earnings == "")
                        $(".earnings").html("0");
                    else {
                        $(".earnings").html(formatter.format(json.balance[0].earnings));
                    }
                    
                     try {
                    if (json.hours48[0].plan_type == 03) {
                        $(".wtt").show();
                        $("#wall_ty").val(json.hours48[0].wallet_alias);
                        $("#wallet_address").val(json.hours48[0].wallet_address);

                        var total_bal2 = json.hours48[0].earnings;

                        if (json.hours48[0].wallet_alias == 1)
                            $(".bitcoin_bal").html(formatter.format(total_bal2));
                        else if (json.hours48[0].wallet_alias == 2)
                            $(".eth_bal").html(formatter.format(total_bal2));
                        else if (json.hours48[0].wallet_alias == 3)
                            $(".cash_bal").html(formatter.format(total_bal2));

                        if (json.hours48[0].earnings == null || json.hours48[0].earnings == "")
                            $(".balance2").html("0");
                        else {
                            var total = json.hours48[0].earnings;
                            $(".balance2").html(formatter.format(total));
                        }

                        if (json.hours48[0].earnings == null || json.hours48[0].earnings == "")
                            $(".earnings").html("0");
                        else {
                            var total2 = json.hours48[0].earnings;
                            $(".earnings").html(formatter.format(total2));
                        }
                        if (json.hours48[0].main_profit == null || json.hours48[0].main_profit == "")
                            $(".all_profit").html("0");
                        else {
                            $(".all_profit").html(formatter.format(json.hours48[0].main_profit));

                        }
                        $("#withdraw_amount").val(total_bal2);
                        $("#trans_id").val(json.hours48[0].transaction_id);

                    } 
                    }
                    catch(e) {
                        console.log(e.stack);
                    }

             
                    try {
                    if (json.hours12[0].plan_type == 02) {
                        $(".wtt").show();
                        $("#wall_ty").val(json.hours12[0].wallet_alias);
                        $("#wallet_address").val(json.hours12[0].wallet_address);
                        var total_bal = json.hours12[0].earnings;

                        $("#withdraw_amount").val(total_bal);
                        $("#trans_id").val(json.hours12[0].transaction_id);

                        if (json.hours12[0].wallet_alias == 1)
                            $(".bitcoin_bal").html(formatter.format(total_bal));
                        else if (json.hours12[0].wallet_alias == 2)
                            $(".eth_bal").html(formatter.format(total_bal));
                        else if (json.hours12[0].wallet_alias == 3)
                            $(".cash_bal").html(formatter.format(total_bal));


                        if (json.hours12[0].earnings == null || json.hours12[0].earnings == "")
                            $(".balance2").html("0");
                        else {
                            var total = json.hours12[0].earnings;
                            $(".balance2").html(formatter.format(total));
                        }

                        if (json.hours12[0].earnings == null || json.hours12[0].earnings == "")
                            $(".earnings").html("0");
                        else {
                            var total2 = json.hours12[0].earnings;
                            $(".earnings").html(formatter.format(total2));
                        }
                        if (json.hours12[0].main_profit == null || json.hours12[0].main_profit == "")
                            $(".all_profit").html("0");
                        else {
                            $(".all_profit").html(formatter.format(json.hours12[0].main_profit));

                        }
                    } 
                    }
                    catch(e) {
                        console.log(e.stack);
                    }
                    try {
                    if (json.hours24[0].plan_type == 01) {
                        $(".wtt").show();
                        $("#wall_ty").val(json.hours24[0].wallet_alias);
                        $("#wallet_address").val(json.hours24[0].wallet_address);

                        var total_bal2 = json.hours24[0].earnings;

                        if (json.hours24[0].wallet_alias == 1)
                            $(".bitcoin_bal").html(formatter.format(total_bal2));
                        else if (json.hours24[0].wallet_alias == 2)
                            $(".eth_bal").html(formatter.format(total_bal2));
                        else if (json.hours24[0].wallet_alias == 3)
                            $(".cash_bal").html(formatter.format(total_bal2));

                        if (json.hours24[0].earnings == null || json.hours24[0].earnings == "")
                            $(".balance2").html("0");
                        else {
                            var total = json.hours24[0].earnings;
                            $(".balance2").html(formatter.format(total));
                        }

                        if (json.hours24[0].earnings == null || json.hours24[0].earnings == "")
                            $(".earnings").html("0");
                        else {
                            var total2 = json.hours24[0].earnings;
                            $(".earnings").html(formatter.format(total2));
                        }
                        if (json.hours24[0].main_profit == null || json.hours24[0].main_profit == "")
                            $(".all_profit").html("0");
                        else {
                            $(".all_profit").html(formatter.format(json.hours24[0].main_profit));

                        }
                        $("#withdraw_amount").val(total_bal2);
                        $("#trans_id").val(json.hours24[0].transaction_id);

                    } 
                    }
                    catch(e) {
                        console.log(e.stack);
                    }
                   
                    try {
                    if (json.hour60[0].plan_type == 04) {
                        $(".wtt").show();
                        $("#wall_ty").val(json.hour60[0].wallet_alias);
                        $("#wallet_address").val(json.hour60[0].wallet_address);

                        var total_bal2 = json.hour60[0].earnings;

                        if (json.hour60[0].wallet_alias == 1)
                            $(".bitcoin_bal").html(formatter.format(total_bal2));
                        else if (json.hour60[0].wallet_alias == 2)
                            $(".eth_bal").html(formatter.format(total_bal2));
                        else if (json.hour60[0].wallet_alias == 3)
                            $(".cash_bal").html(formatter.format(total_bal2));

                        if (json.hour60[0].earnings == null || json.hour60[0].earnings == "")
                            $(".balance2").html("0");
                        else {
                            var total = json.hour60[0].earnings;
                            $(".balance2").html(formatter.format(total));
                        }

                        if (json.hour60[0].earnings == null || json.hour60[0].earnings == "")
                            $(".earnings").html("0");
                        else {
                            var total2 = json.hour60[0].earnings;
                            $(".earnings").html(formatter.format(total2));
                        }
                        if (json.hour60[0].main_profit == null || json.hour60[0].main_profit == "")
                            $(".all_profit").html("0");
                        else {
                            $(".all_profit").html(formatter.format(json.hour60[0].main_profit));

                        }
                        $("#withdraw_amount").val(total_bal2);
                        $("#trans_id").val(json.hour60[0].transaction_id);
                        }
                    }
                    catch(e) {
                        console.error(e.stack);
                    }
                   

                    if(json.withdraw==0) {
                        $(".pending_withdraw").html("0");
                        $(".profit_earned").html("0");
                        $(".total_withdrawal").html("0");
                        $(".w_count").html("0");
                    }
                    else {
                        if (json.withdraw[0].pending_withdrawal == null || json.withdraw[0].pending_withdrawal == "")
                        $(".pending_withdraw").html("0");
                    else
                        $(".pending_withdraw").html(formatter.format(json.withdraw[0].pending_withdrawal));

                    if (json.all_withdrawal[0].w_profit == null || json.all_withdrawal[0].w_profit == "")
                        $(".profit_earned").html("0");
                    else
                        $(".profit_earned").html(formatter.format(json.all_withdrawal[0].w_profit));

                    if (json.all_withdrawal[0].total_withdrawal == null || json.all_withdrawal[0].total_withdrawal == "")
                        $(".total_withdrawal").html("0");
                    else
                        $(".total_withdrawal").html(formatter.format(json.all_withdrawal[0].total_withdrawal));

                    if (json.all_withdrawal[0].w_total == null || json.all_withdrawal[0].w_total == "")
                        $(".w_count").html("0");
                    else
                        $(".w_count").html(json.all_withdrawal[0].w_total);
                    }

                    if (json.total_cashout[0].total == null || json.total_cashout[0].total == "")
                    $(".total_cashout").html("0");
                    else {
                        $(".total_cashout").html(formatter.format(json.total_cashout[0].total));
                    }

                    
                }



            } catch (e) {
                console.error(e.stack);
            }
        },
        //"error": loadingerr
    });
}



function generalStats(extra=null) {

    $.ajax({
        "type": "POST",
        "url": "php/api/statistics.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": "general_stats"
        },
        "success": function(response) {
            try {
                $.unblockUI('hide');
                var json = JSON.parse(response);
                if (json.users[0].total == null || json.users[0].total == "")
                    $(".users_all").attr("data-odometer-final", "0");
                else
                    $(".users_all").attr("data-odometer-final", json.users[0].total);

            } catch (e) {
                console.error(e.stack);
            }
        },
        "error": loadingerr
    });
}


function registerUser() {
    var email = $('#email').val();
    var pwd = $('#password').val();
    var username = $('#username').val();
    var fullname = $('#fullname').val();
    var phoneno = $('#phoneno').val();
    var referral_username = newQueryString('ref');
    if (referral_username == '' || referral_username == null)
        referral_username = '';

    if (username == '' || email == '' || fullname == '' || password == '' || phoneno=='') {
        callSweetMsgNormal("Wells Center Trade", "Some fields are missing", "error");
        return false;
    } else {
        $.blockUI({
            message: '<div class="spinner-grow" role="status"><span class="sr-only">Please wait...</span></div>'
        });

        $.ajax({
            "url": "php/api/account.php",
            "data": {
                "email": email,
                "password": pwd,
                "fullname": fullname,
                "username": username,
                "phoneno":phoneno,
                "referral_username": referral_username,
                "action": "createaccount"

            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                        window.location.href = 'index.html';

                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    $.unblockUI();
                    console.log(e.message);

                }

            },
            "error": function(jqXHR, textStatus) {
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}

function getLastDeposit(extra=null) {

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": "all_deposit"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    $(".latest_deposit").html("");
                    for (var idx in json.data) {
                        var d_date = moment(json.data[idx].deposit_date).format("LL");
                        var li = $('<li><div class="author"><div class="thumb"><a href="#"><img src="assets/images/no_image.png" alt="user"></a></div><div class="content"><a href="#">' + json.data[idx].user.fullname + '</a></div></div><div class="amount--date"><span class="date">' + d_date + '</span><span class="amount">' + formatter.format(json.data[idx].deposit_amount) + '</span></div></li>');
                        $(".latest_deposit").append(li);
                    }

                } else {
                    callSweetMsg(json, "Wells Center Trade", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });

}


function top5Investments() {

$.ajax({
    "url": "php/api/general_page.php",
    "data": {
        "userid": getItem('userid'),
        "sessionid": getItem('sessionid'),
        "action": "top5_investments"

    },
    "type": "POST",
    "success": function(response) {
        try {
            var json = JSON.parse(response);
            $.unblockUI();

            if (json.statuscode == 0) {
                $(".top5div").html("");
                for (var idx in json.data) {
                    var d_date = moment(json.data[idx].deposit_date).format("LLL");
                    var img =  'php/api/get_image.php?userid=' + json.data[idx].userid;
                    var li = $('<li><div class="timeline-panel"><div class="media mr-2 media-info">$</div><div class="media-body"><h5 class="mb-1">Invested: '+formatter.format(json.data[idx].deposit_amount)+'</h5><small class="d-block">'+d_date+'</small></div><div class="dropdown"><button type="button" class="btn btn-info light sharp" data-toggle="dropdown"><svg width="18px" height="18px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg></button></div></div></li>');
                    $(".top5div").append(li);
                }
            } else {
                //callSweetMsg(json, "Wells Center Trade", "error");
            }

            $.unblockUI();
        } catch (e) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log(e.message);
            //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
        }
    },
    "error": function(jqXHR, textStatus) {
        //$.mobile.loading('hide');
        $.unblockUI();
        console.log("Login Error");
    }
});

}


function getWithdrawalHistory(extra=null) {

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": "withdrawal_history"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    $(".latest_withdraw").html("");
                    for (var idx in json.data) {
                        var d_date = moment(json.data[idx].request_date).format("LL");
                        var li = $('<li><div class="author"><div class="thumb"><a href="#"><img src="assets/images/no_image.png" alt="user"></a></div><div class="content"><a href="#">' + json.data[idx].user.fullname + '</a></div></div><div class="amount--date"><span class="date">' + d_date + '</span><span class="amount">' + formatter.format(json.data[idx].withdraw_amount) + '</span></div></li>');
                        $(".latest_withdraw").append(li);
                    }

                } else {
                    callSweetMsg(json, "Wells Center Trade", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });

}

function requestWithdrawal(extra=null) {
    var withdraw_amount = $('#withdraw_amount').val();
    var trans_id = $('#trans_id').val();
    var wallet_type = $("#wall_ty").val();
    var wallet_address = $("#wallet_address").val();
    if (withdraw_amount == '') {
        callSweetMsgNormal("Wells Center Trade", "Withdraw Amount is Required", "error");
        return false;
    } else {
        $.blockUI({
            message: 'Please wait...'
        });
        $.ajax({
            "url": "php/api/general_page.php",
            "data": {
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "withdraw_amount": withdraw_amount,
                "wallet_type": wallet_type,
                "wallet_address": wallet_address,
                "extra":extra,
                "transaction_id": trans_id,
                "action": "withdraw_request"

            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                        window.location.reload();

                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    $.unblockUI();
                    console.log(e.message);

                }

            },
            "error": function(jqXHR, textStatus) {
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}



function startInvestment(transaction_id,extra=null) {
    if (transaction_id == '') {
        callSweetMsgNormal("Wells Center Trade", "Transaction ID cannot be empty", "error");
        return false;
    } else {
        $.blockUI({
            message: 'Please wait...'
        });
        $.ajax({
            "url": "php/api/general_page.php",
            "data": {
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "transaction_id": transaction_id,
                "extra":extra,
                "action": "start_investment"

            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "Wells Center Trade", "success");
                     //   window.location.reload();
                     myActivities('my_deposit');
                    } else {
                        callSweetMsg(json, "Wells Center Trade", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    $.unblockUI();
                    console.log(e.message);

                }

            },
            "error": function(jqXHR, textStatus) {
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}


function bulkAssignList(act) {
    $.blockUI({
        message: '<img src="js/loading.gif" width="70px" alt="Loading" />'
    });
    dopost({
        "url": api_link + "/reports.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "division": getItem('division'),
            "action": act
        },
        "type": "POST",
        "success": function(response) {
            $.unblockUI();
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    var tableDiv = $('#casediv');
                    tableDiv.css("padding-bottom", "10px");
                    tableDiv.html("");
                    tableDiv.addClass("table-responsive");
                    var table = $('<table />');
                    table.addClass('table display responsive table-responsive table-striped table-hover table-bordered');
                    table.attr("width", "100%");
                    table.attr('id', 'casetable');
                    table.attr('cellspacing', '0');
                    var thead = $('<thead />');
                    var theadtr = $('<tr />');

                    var th1 = $('<th />');
                    var th2 = $('<th />');
                    var th3 = $('<th />');
                    var th4 = $('<th />');
                    var th5 = $("<th/>");
                    var th6 = $("<th/>");


                    // th1.html("S/N");
                    var h51 = '<input type="checkbox" id="pushUsers" onchange="checkAll(this)" /> Check All';
                    th1.html(h51);
                    th2.html('System No');
                    th3.html('Type of Filing');

                    theadtr.append(th1);
                    theadtr.append(th2);
                    theadtr.append(th3);
                    theadtr.append(th14);
                    theadtr.append(th15);
                    theadtr.append(th4);
                    theadtr.append(th5);
                    theadtr.append(th9);
                    theadtr.append(th10);
                    theadtr.append(th12);
                    theadtr.append(th11);
                    theadtr.append(th7);
                    theadtr.append(th6);


                    thead.append(theadtr);
                    table.append(thead);
                    var tbody = $('<tbody/>');
                    var sno = 0;

                    for (var idx in json.data) {
                        var tbodytr = $("<tr />");
                        var td1 = $("<td />");
                        var td2 = $("<td />");
                        td2.css("text-transform", "capitalize");
                        var td3 = $("<td />");
                        td3.css("text-transform", "capitalize");
                        var td4 = $("<td />");
                        td3.css("text-transform", "capitalize");
                        var td5 = $("<td />");
                        var td6 = $("<td />");
                        var td7 = $("<td />");
                        var td8 = $("<td />");
                        var td9 = $("<td />");
                        var td10 = $("<td />");
                        var td11 = $("<td />");
                        var td12 = $("<td />");
                        var td14 = $("<td />");
                        var td15 = $("<td />");



                        tbodytr.append(td1);
                        tbodytr.append(td2);
                        tbodytr.append(td3);
                        tbodytr.append(td14);
                        tbodytr.append(td15);
                        tbodytr.append(td4);
                        tbodytr.append(td5);
                        tbodytr.append(td9);
                        tbodytr.append(td10);
                        tbodytr.append(td12);
                        tbodytr.append(td11);
                        tbodytr.append(td7);
                        tbodytr.append(td6);


                        tbody.append(tbodytr);
                    }
                    table.append(tbody);
                    tableDiv.append(table);

                    $('html,body').animate({
                            scrollTop: $("#casediv").offset().top
                        },
                        'slow');

                } else
                    callSweetMsg(json, "Wells Center Trade", "error");
            } catch (e) {
                $.unblockUI();
                console.error(e.message);
            }
        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
        }
    });

}



function myActivities(act,extra=null) {
    $.blockUI({
        message: 'Loading...'
    });
    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": act
        },
        "type": "POST",
        "success": function(response) {
            $.unblockUI();
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    var tableDiv = $('#casediv');
                    tableDiv.css("padding-bottom", "10px");
                    tableDiv.html("");
                    tableDiv.addClass("table-responsive");
                    var table = $('<table />');
                    table.addClass('table vm trans m-2');
                    table.attr("width", "100%");
                    table.attr('id', 'casetable');
                    table.attr('cellspacing', '0');
                    var thead = $('<thead />');
                    var theadtr = $('<tr />');

                    var th1 = $('<th />');
                    var th2 = $('<th />');
                    var th3 = $('<th />');
                    var th4 = $('<th />');
                    var th5 = $("<th/>");
                    var th6 = $("<th/>");

                    th1.html('Investment ID');
                    th2.html('Fullname');
                    th3.html('Amount Invested');
                    th4.html('Status');
                    th5.html('Date Invested');
                    th6.html('Action');
                    theadtr.append(th1);
                    theadtr.append(th2);
                    theadtr.append(th3);
                    theadtr.append(th4);
                    theadtr.append(th5);
                    if(act=='my_deposit')
                    theadtr.append(th6);
                    thead.append(theadtr);
                    table.append(thead);
                    var tbody = $('<tbody/>');
                    var sno = 0;

                    for (var idx in json.data) {
                        sno++;
                        var tbodytr = $("<tr />");
                        var td1 = $("<td />");
                        var td2 = $("<td />");
                        td2.css("text-transform", "capitalize");
                        var td3 = $("<td />");
                        td3.css("text-transform", "capitalize");
                        var td4 = $("<td />");
                        td3.css("text-transform", "capitalize");
                        var td5 = $("<td />");
                        var td6 = $("<td />");
                        var td7 = $("<td />");
                        var td8 = $("<td />");
                        var td9 = $("<td />");
                        var td10 = $("<td />");
                        var td11 = $("<td />");
                        var td12 = $("<td />");
                        var td14 = $("<td />");
                        var td15 = $("<td />");
                        var btn = $("<button />");
                        btn.addClass("btn btn-primary btn-sm");
                        if(json.data[idx].status==1) {
                            btn.html("Investment Started");
                        }
                        else {
                            btn.html("Pending Approval");
                            // btn.attr("onclick",'startInvestment("'+json.data[idx].transaction_id+'")');
                        }
                        var status = json.data[idx].status;
                        var span = $("<span />");
                        if (status == 1) {
                            span.addClass("badge badge-danger");
                            span.html('Investment Running');
                        }
                        else  {
                            span.addClass("badge badge-success");
                            span.html('Pending Approval');
                        }
                        td1.html(json.data[idx].transaction_id);
                        td2.html(json.data[idx].fullname);
                        td3.html(formatter.format(json.data[idx].deposit_amount));
                        td4.append(span);
                        td5.html(json.data[idx].deposit_date);
                        td6.append(btn);

                        tbodytr.append(td1);
                        tbodytr.append(td2);
                        tbodytr.append(td3);
                        tbodytr.append(td4);
                        tbodytr.append(td5);
                        if(act=='my_deposit')
                        tbodytr.append(td6);
                        tbody.append(tbodytr);
                    }
                    table.append(tbody);
                    tableDiv.append(table);
                    $("#casetable").DataTable({
                        "search": { "smart": false },
                        // dom: 'Bfrtip',
                        "bPaginate": true,
                        "paging": true,
                        bFilter: false,
                        bInfo: false,
                        language: {
                            paginate: {
                              next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                              previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
                            }
                        }
                        // buttons: [
                        //     'copy', 'excel', 'print'
                        // ]
                    });
                    $('html,body').animate({
                            scrollTop: $("#casediv").offset().top
                        },
                        'slow');

                } 
                // else {
                //     callSweetMsg(json, "Wells Center Trade", "error");

                // }
                //callSweetMsg(json, "Wells Center Trade", "error");
            } catch (e) {
                $.unblockUI();
                console.error(e.stack);
            }
        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
        }
    });

}


function allWithdrawal(act,extra=null) {
    $.blockUI({
        message: 'Loading...'
    });
    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": act
        },
        "type": "POST",
        "success": function(response) {
            $.unblockUI();
            try {
                var json = JSON.parse(response);
                if (json.statuscode == 0) {
                    var tableDiv = $('#w_div');
                    tableDiv.css("padding-bottom", "10px");
                    tableDiv.html("");
                    tableDiv.addClass("table-responsive");
                    var table = $('<table />');
                    table.addClass('table vm trans m-2');
                    table.attr("width", "100%");
                    table.attr('id', 'w_table');
                    table.attr('cellspacing', '0');
                    var thead = $('<thead />');
                    var theadtr = $('<tr />');

                    var th1 = $('<th />');
                    var th2 = $('<th />');
                    var th3 = $('<th />');
                    var th4 = $('<th />');
                    var th5 = $("<th/>");
                    var th6 = $("<th/>");

                    th1.html('S/No');
                    th2.html('Fullname');
                    th3.html('Amount of Withdrawal');
                    th4.html('Status');
                    th5.html('Date of Withdrawal');

                    theadtr.append(th1);
                    theadtr.append(th2);
                    theadtr.append(th3);
                    theadtr.append(th4);
                    theadtr.append(th5);

                    thead.append(theadtr);
                    table.append(thead);
                    var tbody = $('<tbody/>');
                    var sno = 0;

                    for (var idx in json.data) {
                        sno++;
                        var tbodytr = $("<tr />");
                        var td1 = $("<td />");
                        var td2 = $("<td />");
                        td2.css("text-transform", "capitalize");
                        var td3 = $("<td />");
                        td3.css("text-transform", "capitalize");
                        var td4 = $("<td />");
                        td3.css("text-transform", "capitalize");
                        var td5 = $("<td />");
                        var td6 = $("<td />");
                        var td7 = $("<td />");
                        var td8 = $("<td />");
                        var td9 = $("<td />");
                        var td10 = $("<td />");
                        var td11 = $("<td />");
                        var td12 = $("<td />");
                        var td14 = $("<td />");
                        var td15 = $("<td />");
                        var status = json.data[idx].status;
                        var span = $("<span />");
                        if (status == 1) {
                            span.addClass("badge badge-success");
                            span.html('Approved');
                        }
                        if (status == 0) {
                            span.addClass("badge badge-success");
                            span.html('Pending');
                        }
                        td1.html(sno);
                        td2.html(json.data[idx].fullname);
                        td3.html(formatter.format(json.data[idx].withdraw_amount));
                        td4.append(span);
                        td5.html(json.data[idx].request_date);

                        tbodytr.append(td1);
                        tbodytr.append(td2);
                        tbodytr.append(td3);
                        tbodytr.append(td4);
                        tbodytr.append(td5);

                        tbody.append(tbodytr);
                    }
                    table.append(tbody);
                    tableDiv.append(table);
                    $("#w_table").DataTable({
                        "search": { "smart": false },
                        dom: 'Bfrtip',
                        "bPaginate": true,
                        "paging": true,
                        bFilter: true,
                        bInfo: false,
                        language: {
                            paginate: {
                              next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                              previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>' 
                            }
                        }
                       
                    });
                    $('html,body').animate({
                            scrollTop: $("#w_div").offset().top
                        },
                        'slow');

                } else {
                    console.error("Error");
                }
                //callSweetMsg(json, "Wells Center Trade", "error");
            } catch (e) {
                $.unblockUI();
                console.error(e.stack);
            }
        },
        "error": function(jqXHR, textStatus) {
            $.unblockUI();
        }
    });

}



function getMyDepositHistory(extra=null) {

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": "my_deposit_history"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    $(".my_latest_deposit").html("");
                    for (var idx in json.data) {
                        var d_date = moment(json.data[idx].deposit_date).format("LL");
                        var li = $('<li><div class="author"><div class="thumb"><a href="#"><img src="assets/images/no_image.png" alt="user"></a></div><div class="content"><a href="#">' + json.data[idx].user.fullname + '</a></div></div><div class="amount--date"><span class="date">' + d_date + '</span><span class="amount">' + formatter.format(json.data[idx].deposit_amount) + '</span></div></li>');
                        $(".my_latest_deposit").append(li);
                    }

                } else {
                    callSweetMsg(json, "Wells Center Trade", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });

}




function listAvailableForWithdrawal(domid,extra=null) {
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>' });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "extra":extra,
            "action": "my_available_withdrawal"
        },
        //data: $('#regform').serializeArray(),//new FormData('#regform'),
        "type": "POST",
        "success": function(response) {
            $.unblockUI('hide');
            try {
                var json = JSON.parse(response);

                $("#" + domid + " tbody").empty();
                var total = 0;
                //$('#'+optName).append("<option>Choose Pin Type</option>");
                for (var idx in json.data) {
                    var sn = idx + 1;
                    //alert(record[idx].NAME);
                    var wallet_type = json.data[idx].wallet_type;
                    wallet_type = wallet_type.replaceAll("_", " ");
                    var markup = $("<tr><td><input value=" + json.data[idx].transaction_id + " name='walltype' type='radio' class='wal_type' /></td><td>" + wallet_type + "</td><td class='all_earn'>" + formatter.format(json.data[idx].earnings) + "</td><td style='color:red'>" + formatter.format(json.data[idx].withdraw_amount) + "</td></tr>");
                    //<td><i class='fa fa-edit'></i></td>
                    //<td>"+sn+"</td>
                    markup.find(".wal_type").attr("amount_earn", json.data[idx].earnings);
                    $("#" + domid + " tbody").append(markup);
                    // }
                }
                $("#" + domid).DataTable({
                    "search": { "smart": false },
                    dom: 'Bfrtip',
                    "bPaginate": false,
                    "paging": false,
                    bFilter: false,
                    bInfo: false,
                    buttons: [
                        'copy', 'excel', 'print'
                    ]
                });
            } catch (e) {
                console(e.message);
            }

        },

        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console("Network error");
        }
    });

}

function displayUser() {
    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "display_user"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    for (var idx in json.data) {
                        $("#firstname").val(json.data[idx].firstname);
                        $("#middlename").val(json.data[idx].middlename);
                        $("#address").val(json.data[idx].address);
                        $("#address_html").html(json.data[idx].address);
                        $("#surname").val(json.data[idx].lastname);
                        $("#username").val(json.data[idx].username);
                        $("#email").val(json.data[idx].email);
                        $("#phone").val(json.data[idx].phoneno);
                        $(".name").html(json.data[idx].lastname + ' ' + json.data[idx].firstname);
                        $("#phone_html").html(json.data[idx].phoneno);

                    }

                } else {
                    callSweetMsg(json, "PetCenter", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });
}

function displayProducts(act, cat) {
    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "category": cat,
            "action": act

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    for (var idx in json.data) {

                        var img_src = 'php/api/get_image.php?refid=' + json.data[idx].sku_identification + '';
                        var link = 'pet-detail.html?sku=' + json.data[idx].sku_identification + '';
                        var items = '<div class="pet-block col-md-4 col-sm-6 col-xs-12"><div class="inner-box"><div class="image img-fluid"><img src="' + img_src + '" alt="" /><div class="overlay-box"><div class="overlay-inner"><div class="content"><ul><li><a href="' + link + '">view profile</a></li></ul></div></div></div></div><div class="lower-content"><h3><a href="javascript:;">' + json.data[idx].product_name + '</a></h3><ul><li>' + json.data[idx].description + '</li><li>' + formatter.format(json.data[idx].price) + '</li><li>' + json.data[idx].tags + '</li></ul><a href="#" class="theme-btn btn-style-eight">get me</a></div></div></div>';
                        $("#detailsdiv").append(items);
                    }

                } else {
                    callSweetMsg(json, "PetCenter", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });

}

function showDetailsPage() {
    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "sku": queryString('sku'),
            "action": "get_details"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    for (var idx in json.data) {

                        var img_src = 'php/api/get_image.php?refid=' + json.data[idx].sku_identification + '';
                        var link = 'pet-detail.html?sku=' + json.data[idx].sku_identification + '';
                        var items = '<li><img src="' + img_src + '"></li>';
                        $(".pet_name").html(json.data[idx].product_name);
                        $(".price").html(formatter.format(json.data[idx].price));
                        $("#price_hidden").val(json.data[idx].price);
                        $("#slidediv").append(items);
                        $("#slide2div").append(items);
                    }

                } else {
                    callSweetMsg(json, "PetCenter", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });
}


function updateRecords() {
    var username = $("#username").val();
    var email = $("#email").val();
    var phoneno = $("#phone").val();
    var firstname = $("#firstname").val();
    var middlename = $("#middlename").val();
    var address = $("#address").val();
    var surname = $("#surname").val();
    if (firstname == '' || surname == '' || address == '') {
        callSweetMsgNormal("PetCenter", "Some fields are missing", "error");
        return false;
    } else {
          $.blockUI({
            message: '<div class="spinner-grow" role="status"><span class="sr-only">Please wait...</span></div>'
        });

        $.ajax({
            "url": "php/api/general_page.php",
            "data": {
                "username": username,
                "email": email,
                "phone": phoneno,
                "firstname": firstname,
                "middlename": middlename,
                "surname": surname,
                "address": address,
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "action": "update_record"

            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "PetCenter", "success");

                    } else {
                        callSweetMsg(json, "PetCenter", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    //$.mobile.loading('hide');
                    $.unblockUI();
                    console.log(e.message);
                    //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
                }
            },
            "error": function(jqXHR, textStatus) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}

function addToCart() {
    var sku = queryString('sku');
    if (sku == '' || sku == null)
        sku = '';

    if (sku == '') {
        callSweetMsgNormal("PetCenter", "SKU No cannot be empty", "error");
        return false;
    } else {
        $.blockUI({
            message: 'Loading.....'
        });

        $.ajax({
            "url": "php/api/general_page.php",
            "data": {
                "sku_no": sku,
                "quantity": $("#quantity").val(),
                "userid": getItem('userid'),
                "sessionid": getItem('sessionid'),
                "price": $("#price_hidden").val(),
                "action": "add_to_cart"
            },
            "type": "POST",
            "success": function(response) {
                try {
                    var json = JSON.parse(response);
                    $.unblockUI();

                    if (json.statuscode == 0) {
                        callSweetMsg(json, "PetCenter", "success");
                        displayCartCount();

                    } else {
                        callSweetMsg(json, "PetCenter", "error");
                    }

                    $.unblockUI();
                } catch (e) {
                    //$.mobile.loading('hide');
                    $.unblockUI();
                    console.log(e.message);
                    //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
                }
            },
            "error": function(jqXHR, textStatus) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log("Login Error");
            }
        });
    }
}


function displayCartCount() {
    $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>'
    });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "cart_details"

        },
        "type": "POST",
        "success": function(response) {
            try {
                var json = JSON.parse(response);
                $.unblockUI();

                if (json.statuscode == 0) {
                    for (var idx in json.data) {
                        $(".addcart").html(json.data[idx].total);
                    }

                } else {
                    callSweetMsg(json, "PetCenter", "error");
                }

                $.unblockUI();
            } catch (e) {
                //$.mobile.loading('hide');
                $.unblockUI();
                console.log(e.message);
                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
            }
        },
        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console.log("Login Error");
        }
    });
}

function listMyCart(domid) {
    $.blockUI({ message: 'Loading......' });

    $.ajax({
        "url": "php/api/general_page.php",
        "data": {
            "userid": getItem('userid'),
            "sessionid": getItem('sessionid'),
            "action": "my_cart"
        },
        //data: $('#regform').serializeArray(),//new FormData('#regform'),
        "type": "POST",
        "success": function(response) {
            $.unblockUI('hide');
            try {
                var json = JSON.parse(response);

                $("#" + domid + " tbody").empty();
                var total = 0;
                //$('#'+optName).append("<option>Choose Pin Type</option>");
                for (var idx in json.data) {
                    var sn = idx + 1;
                    //alert(record[idx].NAME);
                    total += json.data[idx].price;
                    // for (var idx2 in json.data[idx].extra) {
                    $("#sub_total").html(formatter.format(total));
                    $("#total_amt").html(formatter.format(total));
                    var markup = "<tr><td>" + json.data[idx].extra.product_name + "</td><td>" + json.data[idx].extra.description + "</td><td>" + json.data[idx].unit_price + "</td><td>" + json.data[idx].quantity + "</td><td>" + json.data[idx].price + "</td><td><i style='cursor:pointer' class='fa fa-trash text-danger' onclick=deleteItem('" + json.data[idx].sku_identification + "')></i></td></tr>";
                    //<td><i class='fa fa-edit'></i></td>
                    //<td>"+sn+"</td>
                    $("#" + domid + " tbody").append(markup);
                    // }
                }
                $("#" + domid).DataTable({
                    "search": { "smart": false },
                    dom: 'Bfrtip',
                    buttons: [
                        'copy', 'excel', 'print'
                    ]
                });
            } catch (e) {
                console(e.message);
            }

        },

        "error": function(jqXHR, textStatus) {
            //$.mobile.loading('hide');
            $.unblockUI();
            console("Network error");
        }
    });

}

function deleteItem(item_sku) {

    bootbox.dialog({
        message: "Are you sure you want to delete Item?",
        title: "PetCenter",
        buttons: {
            danger: {
                label: "No",
                className: "btn-danger btn-sm active",
                callback: function() {}
            },
            success: {
                label: "Yes",
                className: "btn-primary btn-sm",
                callback: function() {
                    $.blockUI({
                        message: 'Loading.....'
                    });

                    $.ajax({
                        "url": "php/api/general_page.php",
                        "data": {
                            "sku_no": item_sku,
                            "userid": getItem('userid'),
                            "sessionid": getItem('sessionid'),
                            "action": "delete_item"
                        },
                        "type": "POST",
                        "success": function(response) {
                            try {
                                var json = JSON.parse(response);
                                $.unblockUI();

                                if (json.statuscode == 0) {
                                    callSweetMsg(json, "PetCenter", "success");
                                    displayCartCount();
                                    listMyCart("cart_table");

                                } else {
                                    callSweetMsg(json, "PetCenter", "error");
                                }

                                $.unblockUI();
                            } catch (e) {
                                //$.mobile.loading('hide');
                                $.unblockUI();
                                console.log(e.message);
                                //doalert("<span style=font-weight:bold; text-align:center>Your Account has been disabled</span>");
                            }
                        },
                        "error": function(jqXHR, textStatus) {
                            //$.mobile.loading('hide');
                            $.unblockUI();
                            console.log("Login Error");
                        }
                    });

                }
            }
        }
    });

}

function addCart2() {


    var cart = {
        item: $(".name").html(),
        price: $("#price_hidden").val(),
        qty: 2
    };
    var jsonStr = JSON.stringify(cart);
    setItem("cart", jsonStr);
    // now the cart is {"item":"Product 1","price":35.50,"qty":2}
    var cartValue = getItem("cart");
    var cartObj = JSON.parse(cartValue);
    // original object

}

function successfulMessageRedirect(json) {
    bootbox.dialog({
        message: json.status,
        title: "Project Name",
        buttons: {
            success: {
                label: "OK",
                className: "btn-primary btn-sm",
                callback: function() {
                    window.location.href = "redirectpath";
                }
            }

        }
    });
}

var appIsActivated = false;
var copyright = 'Copyright © 2020';
var api_link = window.location.protocol + "//" + window.location.host + "/php/api/";
var varappisonline = true;
var doAjaxify = false;
var isLogin = 'true';

function insertCommas(s) {

    // get stuff before the dot
    var d = s.indexOf('.');
    var s2 = d === -1 ? s : s.slice(0, d);

    // insert commas every 3 digits from the right
    for (var i = s2.length - 3; i > 0; i -= 3)
        s2 = s2.slice(0, i) + ',' + s2.slice(i);

    // append fractional part
    if (d !== -1)
        s2 += s.slice(d);

    return s2;

}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

String.prototype.replaceAll = function(find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    doalert(num);
}

Number.prototype.numberFormat = function(decimals, dec_point, thousands_sep) {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = this.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
}


function queryString(sVar) {

    var ret = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return decodeURIComponent(ret.replace(/\+/, ' ').replace(/\%20/, ' ').replace(/\%23/, /\#/));
}

var sessionid = getItem('sessionid');
var userid = getItem('userid');
var login_userid = "";
var spage = getItem('spage');
var loadingerr = function(jqXHR, textStatus) {
    $.unblockUI();
    doalert("Error Connecting...");



};


function doalert(a, extra) {

    var modalBody;
    if ($('#doalertdiv').length == 0)
        modalBody = $('<div/>');
    else {
        modalBody = $('#doalertdiv');
        modalBody.html('');
    }

    modalBody.attr('id', 'doalertdiv');
    modalBody.attr("data-backdrop", "static");
    modalBody.attr("data-keyboard", "false");
    modalBody.css('z-index', '9999');
    modalBody.addClass('modal');
    modalBody.addClass('fade');
    var modalDialog = $('<div/>');
    modalDialog.addClass('modal-dialog');
    modalDialog.css('max-width', '500px');
    modalDialog.css('max-height', '300px');
    modalDialog.attr('data-toggle', 'modal');
    var modalContent = $('<div/>');
    modalContent.addClass('modal-content');
    modalContent.css('border', '4px solid transparent');
    var modalHeader = $('<div/>');
    modalHeader.addClass('modal-header');
    modalHeader.css('background', 'transparent');
    //modalHeader.css('background','#0F5333');
    //modalHeader.css('color','#ffffff');
    //var modalButton = $('<button/>');
    //var buttonModal = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    //modalButton.html(buttonModal);
    var closeButton = $('<div/>');
    var buttonClose = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>';
    closeButton.html(buttonClose);
    var modalTitle = $('<div/>');
    var titleModal = $('<h3/>');
    titleModal.addClass('modal-title h3-responsive text-center');
    titleModal.html("RivCoMis");
    titleModal.css('color', '#444');

    modalTitle.css('line-height', '0.1');
    modalTitle.append(titleModal);
    var modalText = $('<div/>');
    modalText.addClass('modal-body');
    modalText.css('max-height', '300px');
    modalText.css('max-width', '500px');
    modalText.css('overflow-y', 'auto');
    //    modalText.css('border', '5px solid #0F5333');
    var textCon = $('<h5/>');
    textCon.css("text-align", "center");
    textCon.html(a);
    textCon.css('color', '#444');
    var modalFooter = $('<div/>');
    modalFooter.css('background', 'transparent');
    var footerModal = '<div class="modal-footer"><button type="button" class="btn btn-sm btn-primary" data-dismiss="modal">Ok</button>';
    modalFooter.html(footerModal);

    modalHeader.append(closeButton);
    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);
    modalContent.append(modalText);
    modalText.append(textCon);
    modalContent.append(modalFooter);
    modalDialog.append(modalContent);
    modalBody.append(modalDialog);
    modalBody.modal();
}

function appisonline() {
    return varappisonline;
}

function checkStatus(myaction) {
    var mylocation = window.location.href;
    if (myaction == 'login' && mylocation.indexOf('file://') != 0) {
        login();
        return;
    }
    var noalert = false;

    try {

        //                $('#sidebar').mmenu({
        //
        //                });
        //                $('#sidebar-trigger').click(function() {
        //                    $('#sidebar').trigger('open.mm');
        //                });
        //
        //                $('#sidebar a').click(function() {
        //                    $('#sidebar').trigger('close.mm');
        //                });
        //
        //        $("#sidebar").mmenu();
        //            $("#mm-blocker").off( "mousedown" ).off( "touchstart" );
        //            $("#sidebar-trigger").click(function( ev ) {
        //               ev.preventDefault();
        //               if ($("html").hasClass( "mm-opened" )) {
        //                  $("#sidebar").trigger( "close" );
        //               } else {
        //                  $("#sidebar").trigger( "open" );
        //               }
        //        });
        //        $(document).click(function (e) {
        //            $("#sidebar").trigger( "close" );
        //        });

        if (mylocation.indexOf('file://') != 0) {
            if (!(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)) {
                var sel = $("select");
                if (sel.length > 0) {
                    sel.attr('onfocus', 'this.size=10;');
                    sel.attr('onblur', 'this.size=1;');
                    var onchange = sel.attr('onchange');
                    sel.attr('onchange', 'this.size=1; this.blur();' + onchange);
                }

            }
        }
        if (mylocation.indexOf('file://') == 0) {

            var sel = $("select");
            if (sel.length > 0) {
                sel.attr('onfocus', 'this.size=10;');
                sel.attr('onblur', 'this.size=1;');
                var onchange = sel.attr('onchange');
                sel.attr('onchange', 'this.size=1; this.blur();' + onchange);
            }
        }


        /*var docHeight = parseInt($(window).height() * 0.8);
        var containerHeight = $('.page-content').height();
        var containerTop = $('.page-content').position().top;
        var containerPos = containerTop + containerHeight;
        var spaceLeft = docHeight - containerPos - 40;
        if (spaceLeft>0) {
            var newContainerHeigth = spaceLeft + containerHeight;
        $('.page-content').css('height', newContainerHeigth + 'px');
        }*/
    } catch (e) {

        console.error(e.message);
    }

    //    var docHeight = $(window).height();
    //    var footerHeight = $('#footer').height();
    //    var footerTop = $('#footer').position().top + footerHeight;
    //
    //    if (footerTop < docHeight) {
    //    $('#footer').css('margin-top', 10+ (docHeight - footerTop) + 'px');
    //    }
    //    var editHome = function(el){
    //        if(el.length>0)
    //        {
    //            el.on('click',gotoHomePage);
    //            el.attr('href','#');
    //        }
    //    };
    //
    //    editHome($('.brand-logo'));
    //    editHome($(".navbar-brand"));
    //    editHome($(".nvhome"));
    var statusData = {
        "userid": getItem('userid'),
        "myaction": myaction,
        "useralias": (myaction == 'login' ? $("#name").val() : '')
    };

    dopost({
        url: api_link + "/status.php",
        type: "POST",
        data: statusData,
        error: function(jqXHR, exception) {
            //alert('offline');
            $('.offline').css('display', 'none');
            $('.homeOffline').show();
            varappisonline = false;
        },
        success: function(response) {

            try {
                var json = JSON.parse(response);
                if (json.hasOwnProperty("address")) {
                    var addresses = json.address.join(", ");
                    if (json.address.length == 0) {
                        $("#ipadd").hide();
                    } else {
                        $("#ipaddress").html(addresses);
                        $("#ipaddress").css("color", "red");
                    }
                }
                var myaction = "";
                if (json.hasOwnProperty("myaction"))
                    myaction = json.myaction;
                if (json.status === 'offline') {
                    $('.offline').css('display', 'none');
                    $('div.hm').css('height', '100%');
                    $('.homeOffline').show();
                    varappisonline = false;
                } else {
                    $('.offline').css('display', 'block');
                    $('.offline2').css('display', 'block');
                    $('.dn').css('display', 'none');
                    $('.homeOffline').hide();
                    $('div.hmheight').css('height', '100%');
                    $('div.hm').css('height', '100%');
                    varappisonline = false;
                }

                var current_page = window.location.href;

                if (myaction == "login") {
                    if (json.activated == 0)
                        activationForm(json);
                    else
                        login();
                } else {
                    if (json.activated == 0) {
                        var activeStatus;
                        appIsActivated = false;
                        activeStatus = $('.activationStatus').html('Not Activated');
                        activeStatus.css('color', 'red');
                        activeStatus.css('font-weight', 'bold');
                        activeStatus.css('font-size', '10pt');
                    } else {
                        appIsActivated = true;
                        $('.licensename').html(getItem('name'));
                        activeStatus = $('.activationStatus').html('Activated');
                        activeStatus.css('color', '#1354B2');
                        activeStatus.css('font-weight', 'bold');
                        activeStatus.css('font-size', '10pt');
                    }

                    if (json.activated == 0 && getItem('activationalert') != 'done' && (current_page.indexOf('/home.html') > 0 || current_page.indexOf('/teacher.html') > 0 || current_page.indexOf('/admin.html') > 0)) {
                        doalert("This Version of BrainFriend has not been Activated.<br><a href=# onclick='licenseDialog();' data-dismiss='modal'><span style='font-size:12pt !important; font-weight:bold; color:#ff0000;'>Click here</span></a> to activate.");
                        getItem('activationalert', 'done');



                    }



                }

                //                 if(getItem("useralias")=="guest")
                //                            {
                //                               updateProfileAlert();
                //                            }

                if (json.hasOwnProperty('subscription')) {
                    if (parseInt(json.subscription.DaysLeft) < 6 && !noalert && (current_page.indexOf('/home.html') > 0)) {
                        noalert = true;
                        doalert('This Version of BrainFriend is expiring in <span style="color:red !important">' + json.subscription.DaysLeft + '</span> days time, please renew your subscription.');
                    }
                }

                if (json.activated == 0 && (current_page.indexOf('/resourceshelf.html') > 0)) {
                    doalert("<span style='color:red; font-weight:bold'>License</span> is required to view this page");
                }
                if (json.activated == 0 && getItem('activationalert') != 'done' && (current_page.indexOf('/counselling.html') > 0)) {
                    doalert("<span style='color:#006633; font-weight:bold'>License</span> is required to view this page <a href=# onclick='licenseDialog();' data-dismiss='modal'><span style='font-size:12pt !important; font-weight:bold; color:#ff0000;'>Click here</span></a> to get your license.");
                    getItem('activationalert', 'done');
                }

                if ($(".profileimg").length > 0) {
                    if (json.profileimage != "") {
                        $(".profileimg").attr('src', json.profileimage);
                    }
                }
                if ($(".loginimg").length > 0) {
                    if (json.profileimage != "") {
                        $(".loginimg").attr('src', json.profileimage);
                    }
                }
            } catch (e) {
                $('.offline').css('display', 'none');
                $('.homeOffline').show();
                varappisonline = false;
                //doalert("Error " + response + e.message);
            }
            //alert('Online')
            varappisonline = true;
        }
    });
}

function setItem(key, value) {
    //sessionStorage
    if (window.localStorage) {
        window.localStorage.setItem(key, value);
    }
}

function getItem(key, value) {
    if (window.localStorage) {
        return window.localStorage.getItem(key, value);
    }

}

function removeItem(key) {
    if (window.localStorage) {
        window.localStorage.removeItem(key);
    }

}

function dopost(json) {
    try {
        window.bfApp.execute(json.success, json.error, 'BfAppPlugin', json.url, [json.data]);
    } catch (e) {
        try {
            //if(window.bfMobileApp.useCordova())
            cordova.exec(json.success, json.error, 'BfAppPlugin', 'dopost', [json.url, json.data]);
            //else
            //   window.bfMobileApp.exec(json.success.toString(), json.error.toString(), 'BfAppPlugin', 'dopost', JSON.stringify({"args":[json.url, json.data]}));
        } catch (e) {
            try {
                if (window.location.href.indexOf("file://") == 0) {
                    window.setTimeout(function() {
                        dopost(json);
                    }, 1000);
                    return;
                }
                try {
                    if (!json.data.hasOwnProperty('userid')) {
                        json.data['userid'] = getItem('userid');
                    }
                } catch (e) {
                    console.error(e.stack);
                }

                if (typeof Fingerprint2 === 'function' && Fingerprint2 != null) {
                    var fp2 = new Fingerprint2();
                    fp2.get(function(result) {
                        var result2 = getItem("sessionid");
                        if (result2 === '' || result2 == null || result2 === 'undefined' || typeof(result2) === 'undefined') {
                            result2 = result;
                            setItem('sessionid', result2);
                        }
                        json.data['sessionid'] = result2;
                        dopostoffline(json);
                    });
                } else
                    dopostoffline(json);
            } catch (e) {
                console.error(e.message);
            }
        }

    }
}

function testResponse(respponse) {
    var ret = true;
    try {
        var json = JSON.parse(respponse);
        if (json.statuscode == 401) {
            json.statuscode = -1;
            json.sessionerror = json.status;
        }
        if (json.hasOwnProperty('sessionerror')) {
            if (json.statuscode == -1) {
                $.unblockUI();
                sessionMsg(json)
                ret = false;
            }
        }
    } catch (e) {
        console.error(e.message);
    }
    return ret;
}

function dopostoffline(json) {
    if (window.location.href.indexOf('file://') != 0) {

        var isApp = false;
        if (json.type == "POST") {

            $.post('/php/dopost.php?url=' + encodeURIComponent(json.url), json.data, function(response) {
                    if (response === '')
                        response = '{}';
                    if (testResponse(response))
                        json.success(response);
                })
                .fail(json.error);

        } else {

            $.get('/php/dopost.php?url=' + encodeURIComponent(json.url), function(response) {
                    if (response === '')
                        response = '{}';
                    if (testResponse(response))
                        json.success(response);
                })
                .fail(json.error);

        }
    } else {
        window.setTimeout(function() {
            dopost(json);
        }, 300)
    }
}


function dopostold(json) {
    var isApp = false;
    var windowobj = (window.top === window.self ? window : window.parent);

    if (typeof bfApp === 'object' && bfApp != null) {
        if (typeof bfApp.execute === 'function')
            isApp = true;
    } else {
        if (typeof windowobj === 'object') {
            if (typeof windowobj.bfApp === 'object' && windowobj.bfApp != null) {
                if (typeof windowobj.bfApp.execute === 'function') {
                    isApp = true;
                    var bfApp = windowobj.bfApp;
                }
            }
        }
    }

    if (json.type == "POST") {
        if (isApp == false) {
            $.post('php/dopost.php?url=' + encodeURIComponent(json.url), json.data, function(response) {
                    if (response === '')
                        response = '{}';
                    json.success(response);
                })
                .fail(json.error);
        } else {
            try {
                bfApp.execute(json.success, json.error, json.url, '', [json.data]);
            } catch (e) {
                console.error(e.message)
            }
        }
    } else {
        if (isApp == false) {
            $.get('php/dopost.php?url=' + encodeURIComponent(json.url), function(response) {
                    if (response === '')
                        response = '{}';
                    json.success(response);
                })
                .fail(json.error);
        } else {
            try {
                bfApp.execute(json.success, json.error, json.url, '', []);
            } catch (e) {
                console.error(e.message)
            }
        }
    }


}

function resetItems(donotload) {

    //setItem("login_userid", "");
    setItem("userid", "");
    setItem("sessionid", "");
    setItem("surname", "");
    setItem('caseid', "");
    setItem("firstname", "");
    setItem("useralias", "");
    setItem("photo", "");
    setItem("access_token", "");
    setItem("var1", "");
    setItem("var2", "");
    setItem("category", "");
    try {
        if (window.localStorage) {
            window.localStorage.clear();
        }
    } catch (e) {}
    if (!(typeof donotload === 'undefined' ? false : donotload))
        window.location.href = "index.html";
}
var globalupdate;

var page_redirect = window.location.href;

function sessionMsg(json) {
    bootbox.dialog({
        message: json.sessionerror,
        title: "Session Management",
        buttons: {
            success: {
                label: "OK",
                className: "btn-primary btn-sm",
                callback: function() {
                    if ((page_redirect.indexOf('/admin') > 0 || page_redirect.indexOf('/games') > 0)) {
                        window.location.href = "../admin/index.html";
                    } else {
                        window.location.href = "https://rivcomis.riversstate.gov.ng/mis/account.html";
                    }
                }
            }

        }
    });
}


try {
    var fingerprint_script_file = $("<script/>");
    fingerprint_script_file.attr("type", "text/javascript");
    var this_script_file = $('script').last();
    var this_script_file_path = this_script_file.attr('src');
    fingerprint_script_file.attr("src", this_script_file_path.replace("common.js", "fingerprint.min.js"));
    this_script_file.after(fingerprint_script_file);
} catch (e) {
    console.log(e.message);
}