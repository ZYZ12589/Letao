$(function () {
    // 1-发送 ajax， 请求数据，渲染页面
    // 定义 当前页码和每页条数
    var currentPage = 1;
    var pageSize = 5;

    // 加载页面，执行 ajax 请求
    render();

    // 封装 ajax 请求
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);

                // 使用模板引擎渲染页面
                $("tbody").html(template("secondTmp", info));

                // 添加分页标签
                $("#pageiator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
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

    // 2-点击添加按钮，显示模态框，渲染一级下拉菜单
    $(".addClassify").click(function () {
        // 显示模态框
        $("#secondModal").modal("show");

        // 渲染一级下拉菜单

        $.ajax({
            type: 'get',
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                $(".dropdown-menu").html(template("dropdownTmp", info));
            }
        })
    })

    // 3-给下拉菜单的选项注册点击事件，选中后，修改顶部按钮的文本，同时将自身的自定义属性 data-id 赋值给隐藏域

    $(".dropdown-menu").on("click", "a", function () {
        $(".dropdown_btn").text($(this).text());

        // 将自定义属性赋值给隐藏域
        $("[name='categoryId']").val($(this).data("id"));

        // 重置表单状态
        $("#form").data('bootstrapValidator').updateStatus("categoryId", "VALID");
    })


    // 4-点击添加图片按钮，上传图片，返回图片地址
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data);

            // 获取图片 url 地址
            var picUrl = data.result.picAddr;
            console.log(picUrl);

            // 将图片 url 地址赋值给 img
            $(".pic_img").attr("src", picUrl);

            // 将图片 url 地址赋值给隐藏域
            $("[name='brandLogo']").val(picUrl);

            // 修改表单状态
            $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    // 5-添加表单校验
    $("#form").bootstrapValidator({
        // 指定不校验的类型
        excluded: [],

        // 指定校验时的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 指定校验字段
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请添加图片"
                    }
                }
            }
        }
    })

    // 6-通过表单验证成功事件
    $("#form").on('success.form.bv', function (e) {
        // console.log($("#form").serialize());
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $("#form").serialize(),
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    // 隐藏模态框
                    $("#secondModal").modal("hide");
                    // 重置当前页
                    currentPage = 1;
                    // 重新渲染
                    render();
                }
            }
        })
    });

})