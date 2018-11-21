/**
 * 需求：添加进度条功能
 * Nprogress.start();   开启进度条
 * Nprogress.done();    关闭进度条
 */

/**
 * ajax 全局事件
 * 需求：1、在第一个 ajax 发送请求时，开启进度条
 *       2、在最后一个 ajax 请求完成后，关闭进度条
 * 
 * ajaxComplate()  在每个 ajax 完成请求时调用（不论成功与失败）
 * ajaxSuccess()   在每个 ajax 如果成功时调用
 * ajaxError()     在每个 ajax 如果失败时调用
 * 
 * ajaxStart()     在第一个 ajax 请求发送时调用
 * ajaxStop()      在所有 ajax 请求完成时调用
 */

$(function () {


    $(document).ajaxStart(function () {
        NProgress.start();
    })

    $(document).ajaxStop(function () {
        NProgress.done();
    })



    /**
     * 公共需求：
     *      1、左侧二级菜单切换
     *      2、左侧菜单显示和隐藏切换
     *      3、点击退出按钮，退出登录
     * 
     * 思路：
     *      1、二级菜单切换
     *          点击 a 标签，禁止浏览器默认跳转
     *          给 兄弟元素 ul 添加基本动画 slideToggle
     * 
     *      2、左侧菜单显示和隐藏
     *          点击菜单按钮，改变左侧菜单 left 值，固定定位
     *          改变右侧主体部分的 padding-left 值，改变其宽度
     *          添加过渡，实现动画效果
     * 
     *          addClass  添加类
     *          hasClass  检测类
     *          removeClass 删除类
     *          toggleClass 切换类
     * 
     *          attr      设置或获取属性
     *          removeAttr 移除属性
     * 
     *      3、登出
     *          发送 ajax请求，让后台清除登录记录，
     *          成功则跳转页面，失败则提示服务器繁忙，请稍后再试
     *                    
     * 
     * 
     */

    // 二级菜单切换
    $(".aside_nav .current").click(function () {
        $(this).next().stop().slideToggle();
    })

    // 左侧菜单切换
    $(".menu").click(function () {
        $('.lt_aside').toggleClass("cut");
        $(".lt_main").toggleClass("cut");
        $(".main_title").toggleClass("cut");
    })



    // 登出功能
    $(".logout").click(function () {
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    location.href = "login.html";
                }
                if (info.error) {
                    message("服务器繁忙，请稍后再试！");
                }
            }
        })
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
})






