$(function () {

    // 利用 ajax 发送请求数据，然后利用模板引擎渲染数据

    var page = 1;
    var pageSize = 5;

    // 页面打开自动执行一次
    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: page,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);

                // 使用模板引擎渲染数据
                var htmlStr = template("user_tmp", info);
                $("tbody").html(htmlStr);
            }
        })
    }
})