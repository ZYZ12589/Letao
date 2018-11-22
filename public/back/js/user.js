$(function () {

    // 利用 ajax 发送请求数据，然后利用模板引擎渲染数据

    // 保存 页码 和每页条数
    var currentPage = 1;
    var pageSize = 5;

    // 页面打开自动执行一次
    render();

    // 封装 ajax 请求
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);

                // 使用模板引擎渲染数据
                var htmlStr = template("user_tmp", info);
                $("tbody").html(htmlStr);

                // 添加分页
                $(".paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,  // bootstrat 版本
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


    // 使用事件委托，给按钮注册点击事件，根据按钮状态，修改用户状态
    // 按钮：  启用 ==>  禁用    禁用  ==>  启用

    var id;
    var isDelete;

    // 注册事件委托
    $("tbody").on("click", '.btn', function () {
        // 显示模态框
        $('#btnModal').modal("show");

        // 获取用户 id
        id = $(this).parent().data("id");

        // 根据按钮状态，判断用户需要修改的状态
        // isDelete = $(this).hasClass("btn-success") ? 0 : 1;
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    })


    // 点击确定按钮，修改用户装填
    $(".update_user").click(function () {

        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id: id, // 用户id
                isDelete: isDelete // 将用户改成什么状态, 1启用, 0禁用
            },
            dataType: "json",
            success: function (info) {
                console.log(info)
                if (info.success) {
                    // 关闭模态框
                    $('#btnModal').modal("hide");  // show hide
                    // 重新渲染页面
                    render();
                }
            }
        })


    })










})