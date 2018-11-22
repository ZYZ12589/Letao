$(function () {
    // 1-发送 ajax，请求数据，使用模板引擎进行渲染

    // 定义 页码 和 每页条数
    var currentPage = 1;
    var pageSize = 2;

    // 加载页面调用函数
    render();

    // 封装 ajax 请求
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
                // 使用模板引擎渲染页面
                $("tbody").html(template("first_tmp", info));

                // 添加分页标签
                $("#pagenator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, // 确定版本号
                    currentPage: info.page,
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

    // 2-点击添加分类按钮，显示模态框
    $(".addClassify").click(function () {
        // 显示模态框
        $("#firstModal").modal("show");

    })

    // 3-添加表单校验
    $("#form").bootstrapValidator({
        // 指定校验时显示的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 指定校验字段
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类"
                    }
                }
            }
        }
    })

    // 4-注册表单验证成功事件，清除浏览器默认请求，利用 ajax 请求数据
    $("#form").on('success.form.bv', function (e) {

        // 请求默认请求
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $("#form").serialize(),
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    //    隐藏模态框
                    $("#firstModal").modal("hide");

                    // 重置当前页
                    currentPage = 1;

                    // 重新渲染页面
                    render();
                }
            }
        })
    })
})
