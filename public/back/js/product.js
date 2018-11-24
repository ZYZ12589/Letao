$(function () {
    // 1-发送 ajax 请求，获取数据，渲染页面
    // 定义当前页和每页调条数
    var currentPage = 1;
    var pageSize = 3;

    // 声明数组，保存图片信息
    var picArr = [];

    // 打开页面，执行 ajax 请求
    render();

    // 封装 ajax 请求
    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                // 使用模板引擎，渲染页面
                $("tbody").html(template("prd_tmp", info));

                // 添加分页标签
                $("#pageiator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,   // 声明版本号
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        })
    }

    // 2-点击添加商品按钮，显示模态框，获取二级菜单数据，渲染下拉框
    $(".add_btn").click(function () {
        $("#add_modal").modal("show");

        // 发送 ajax 请求，获取二级菜单数据，渲染下拉框
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 50
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $(".dropdown-menu").html(template("dropdownTmp", info));
            }
        })
    })

    // 3-点击下拉菜单，改变按钮文本，将数据 id 赋值给隐藏域
    $(".dropdown-menu").on("click", "a", function () {
        // 修改按钮文本
        $(".dropdown_btn").text($(this).text());

        // 获取数据 id，赋值给隐藏域
        var id = $(this).data("id");
        $("[name='brandId']").val(id);

        // 修改模态框状态
        $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    // 4-配置 fileupload ，实现文件上传
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data);
            // 获取图片信息
            var picObj = data.result;

            // 保存到数组
            picArr.unshift(picObj);
            console.log(picArr);

            picUrl = picObj.picAddr;
            $(".img_box").prepend('<img class="pic_img" src="' + picUrl + '" style="width: 100px; height: 100px;">')


            if (picArr.length > 3) {
                // 删除数组最后一个
                picArr.pop();

                // 删除最后一个 img 标签
                $(".img_box img:last-of-type").remove();

            }

            // 修改表单状态
            if (picArr.length == 3) {
                $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID")
            }
        }
    });


    // 5-配置表单校验
    $("#form").bootstrapValidator({

        // 1. 指定不校验的类型
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 指定校验字段
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级菜单"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零的数字开头'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '必须是xx-xx的格式，例如：32-45'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    })

    // 注册表单验证成功事件，阻止默认提交，通过 ajax 提交数据
    $("#form").on("success.form.bv", function (e) {
        // 阻止默认提交
        e.preventDefault();

        // 拼接表单信息字符串
        var paramsStr = $("#form").serialize();

        paramsStr += "picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        paramsStr += "picName1=" + picArr[1].picName + "&picAddr1=" + picArr[1].picAddr;
        paramsStr += "picName1=" + picArr[2].picName + "&picAddr1=" + picArr[2].picAddr;


        // 通过 ajax 提交数据
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType: 'json',
            success: function (info) {
                // console.log(info);

                // 隐藏模态框
                $("#add_modal").modal("hide");

                // 重置当前页
                currentPage = 1;

                // 重新渲染
                render();

                // 重置表单内容和状态
                // console.log($("#form").data("bootstrapValidator"));
                $("#form").data("bootstrapValidator").resetForm(true);

                // 重置下拉菜单按钮，和 图片展示
                $(".dropdown_btn").text("请选择二级分类");

                // 清空图片
                $(".img_box img").remove();
                // 清空数组
                picArr = [];
            }
        })
    })
})