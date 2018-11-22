// 发送 ajax 请求，获取数据，使用模板引擎 渲染数据

// 声明变量，保存页码和每页条数
var currentPage = 1;
var pageSize = 2;

// 打开页面调用函数
render();

// 封装 ajax 函数
function render() {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategoryPaging',
        data: {
            page: currentPage,
            pageSize: pageSize
        },
        dataType: 'json',
        success: function (info) {
            // 使用模板引擎，渲染数据
            var htmlStr = template("first_tmp", info);
            $("tbody").html(htmlStr);

            // 分页初始化
            $(".paginator").bootstrapPaginator({
                bootstrapMajorVersion: 3, // 指定版本号
                currentPage: info.page,  // 当前页
                totalPages: Math.ceil(info.total / info.size),
                onPageClicked: function (a, b, c, page) {
                    // 更新当前页
                    currentPage = page;
                    // 重新渲染页面
                    render();
                }
            })

        }

    })
}

// 点击添加分类按钮，显示模态框
$(".addSort").click(function () {
    $("#sortModal").modal("show");
})


// 验证表单
$('#form').bootstrapValidator({
    // 配置小图标
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',   // 校验成功
        invalid: 'glyphicon glyphicon-remove',   // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段
    fields: {
        categoryName: {
            // 配置校验规则
            validators: {
                // 配置非空校验
                notEmpty: {
                    message: "请输入一级分类名称"
                }
            }
        }
    }
});

// 点击确定按钮，阻止默认提交，使用 ajax 发送请求

$("#form").on('success.form.bv', function (e) {
    e.preventDefault();

    $.ajax({
        type: 'post',
        url: '/category/addTopCategory',
        data: $("#form").serialize(),
        dataType: 'json',
        success: function (info) {
            // 隐藏模态框
            $("#sortModal").modal("hide");

            currentPage = 1;

            // 渲染页面
            render();

            // 重置表单
            $("#form").data('bootstrapValidator').resetForm(true);
        }
    })
})