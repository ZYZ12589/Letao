/**
 * 需求：表单校验
 *  1、进行表单校验配置
 *  2、校验要求：
 *      - 用户名不能为空，长度为2-6位
 *      - 密码不能为空，长度6-12位
 */

//使用表单校验插件
$("#formId").bootstrapValidator({


    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },


    // 指定校验字段
    fields: {
        // 配置用户名
        username: {
            validators: {
                //不能为空
                notEmpty: {
                    message: '用户名不能为空'
                },
                //长度校验
                stringLength: {
                    min: 2,
                    max: 6,
                    message: '用户名长度必须在2-6位之间'
                },
                callback: {
                    message: '用户名不存在'
                }
            }
        },
        // 配置密码
        password: {
            validators: {
                // 不能为空
                notEmpty: {
                    message: "密码不能为空"
                },
                // 长度校验
                stringLength: {
                    min: 6,
                    max: 12,
                    message: '密码的长度必须在6-12位之间'
                },
                callback: {
                    message: '密码错误'
                }
            }
        }
    }

});


/**
 * 需求：表单提交
 * 思路：
 *      1、禁止表单自动提交
 *      2、利用 ajax 进行提交
 */

$("#formId").on('success.form.bv', function (e) {

    // 阻止默认的表单提交
    e.preventDefault();


    //使用ajax提交逻辑
    $.ajax({
        type: 'post',
        url: '/employee/employeeLogin',
        data: $("#formId").serialize(),
        dataType: 'json',
        success: function (info) {
            if (info.success) {
                location.href = "./index.html";
            }
            if (info.error === 1000) {
                // alert(info.message);
                message(info.message);
                $('#formId').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
            }
            if (info.error === 1001) {
                // alert(info.message);
                message(info.message);
                $('#formId').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
            }
        },
        error: function () {
            console.log("服务器繁忙，请稍后再试！")
        }
    })
});


/**
 * 需求：点击重置按钮，重置表单内容和状态
 * 思路：调用表单验证插件的方法，重置表单状态,reset 按钮自带重置表单内容的功能
 */

$("[type = reset]").click(function () {
    $("#formId").data('bootstrapValidator').resetForm();

})

// 封装弹窗动画
function message(text) {
    $(".message-text").text(text)
    $(".message").animate({
        top: "60px",
        opacity: 1
    }, 700, function () {
        setTimeout(function () {
            $(".message").animate({
                top: "-80px",
                opacity: 0
            }, 500);
        }, 1200);
    })
}