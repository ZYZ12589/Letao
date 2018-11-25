$(function () {
    // 1-发送 ajax 请求，获取数据，渲染页面
    // 声明当前页和每页数量
    var currentPage = 1;
    var pageSize = 3;

    // 声明数组，保存图片信息
    var picArr = [];


    // 加载页面，执行 ajax 请求
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
                console.log(info);

                // 通过模板引擎，渲染数据
                $("tbody").html(template("prd_tmp", info));

                // 添加分页标签
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,  // 指定版本号
                    currentPage: info.page,  // 当前页
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

    // 2-点击添加商品按钮，显示模态框
    $(".add_btn").click(function () {
        // 显示模态框
        $("#add_modal").modal("show");

        // 发送 ajax 请求，获取二级菜单数据，渲染下拉菜单
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $(".dropdown-menu").html(template("dropdown_tmp", info));
            }
        })

    })

    // 3-点击下拉菜单，改变按钮文本，将数据 id 赋值给隐藏域
    $(".dropdown-menu").on("click", "a", function () {
        // 改变按钮文本
        $(".dropdown_btn").text($(this).text());
        // 将数据 id 赋值给隐藏域
        $("[name=brandId]").val($(this).data("id"));
        // 修改隐藏域状态
        $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    // 4- 通过 fileupload，实现文件上传
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            console.log(data);
            // 获取图片信息()
            var picObj = data.result;

            // 将数据保存到数组
            picArr.unshift(picObj);
            // console.log(picArr);


            // 获取图片 url
            picUrl = picObj.picAddr;
            $(".img_box").prepend('<img class="pic_img" src="' + picUrl + '" style="width: 100px; height: 100px;">');

            // 根据数组长度，判断图片是否删除
            if (picArr.length > 3) {
                // 删除数组最后一项
                picArr.pop();

                // 删除最后一个 img 标签
                $(".img_box img:last-of-type").remove();
            }

            if (picArr.length === 3) {
                $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }
        }
    });

    // 5-表单校验
    $("#form").bootstrapValidator({
        // 1、指定不校验的类型
        excluded: [],

        // 2、指定校验时的显示图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 3、校验字段
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
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
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '必须是XX-XX的格式，例如32-46'
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
                        message: "选择3张图片"
                    }
                }
            },

        }
    })



    // 6-注册表单校验成功事件，阻止默认提交，通过 ajax 提交数据
    $('#form').on("success.form.bv", function (e) {
        // 阻止默认提交
        e.preventDefault();

        // 拼接字符串
        var picStr = $("#form").serialize();

        // picStr += "picName1=picName1&picAddr1=picAddr";
        picStr += "picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        picStr += "picName1=" + picArr[1].picName + "&picAddr1=" + picArr[1].picAddr;
        picStr += "picName1=" + picArr[2].picName + "&picAddr1=" + picArr[2].picAddr;

        // console.log(picStr);


        // 通过 ajax 提交数据
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: picStr,
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $("#add_modal").modal("hide");
                // 重置当前页
                currentPage = 1;
                render();

                // 重置表单
                $("#form").data("bootstrapValidator").resetForm(true);

                $(".dropdown_btn").text("请选择二级分类");

                $(".img_box").remove();

                picArr = [];
            }
        })
    })

})