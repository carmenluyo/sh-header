$.fn.megaMenu = function(options){
  // All defaualt settings
  var defaults = {
    caret: false,
    textHighlighter: false,
    caretArrows: [{
      up: "caret-up",
      down: "caret-down",
    }],
  };

  var settings = $.extend ({
    menuBehaviour: "click",
    stickyHeader: true,
    selector: $(this),
    caret:"",
    caretArrows: [{
      up: "",
      down: "",
      upUrl:"",
      downUrl:"",
    }],
    highlighter: true,
    followingHighlighter: false,
    highlightColor:"",
    textHighlighterColor: "",
    animation:false,
    animationClass: "",
  }, defaults, options)

  var mainLinks = $(".main-links ul li a");
  var subMenu = $(".menu-dropdown .menu-item-wrapper");
  var mainLinksDataAttribute = [];
  var iDofSubMenus = [];

  var caretUp = defaults.caretArrows[0].up;
  var caretDown = defaults.caretArrows[0].down;

  // Sticky Heder
  if (settings.stickyHeader === false) {
    $(".mega-menu").removeClass("sticky-header");
  } else {
    $(".mega-menu").addClass("sticky-header");
  }

  // If caret: custom then it will exclude default settings mentioned above
  if (settings.caret === true) {
    var caretUp = settings.caretArrows[0].up;
    var caretDown = settings.caretArrows[0].down;
  }

  // If icon caret (up or down) is not empty image caret should be hidden
  if (settings.caretArrows[0].up || settings.caretArrows[0].down ) {
    settings.caretArrows[0].upUrl = null;
    settings.caretArrows[0].downUrl = null;
  }

  // Creating Caret icon for every link which have data-submenu attribute
  $("a[data-submenu]").append('<span class="caret ' + caretDown + '"></span>');

  // Set Initial Image path for carret (Default is down)
  if (settings.caret === true && settings.caretArrows[0].downUrl !== "") {
    $(".mega-menu span.caret").removeClass("undefined");
    $(".mega-menu span.caret").addClass("caret-img down");
    $(".mega-menu span.caret.caret-img.down").css({"background-image" : "url(" +settings.caretArrows[0].downUrl+ ")"});
  }

  // Append Style on DOM
  $(`<style>
      .mega-menu .main-links ul li a:hover{
        border-color:` +settings.highlightColor+
      `}
    </style>`).appendTo("head");

  // Remove Active link Highlight
  mainLinks.on(settings.menuBehaviour, function(){
    mainLinks.removeClass("highlight");
    mainLinks.css({"border-color":""});
  });

  // If a user didn't defined menu behaviour
  if (settings.menuBehaviour === "") {
    settings.menuBehaviour = "click";
  }

  // Menu Toggle Works
  mainLinks.each(function(i){
    var linkID = $(this).attr("data-submenu");

    mainLinksDataAttribute.push($(this).attr("data-submenu"));

    $(this).on(settings.menuBehaviour,function(){
      // Find Position of Menu ULs to help pass index for perticular ID on each menu links
      var findPositionOfSubmenus = jQuery.inArray( linkID, iDofSubMenus );

      var imageCaret = $(this).find(".caret.caret-img");

      // Sets every links default behavour for caret except currently clicked
      mainLinks.find("span").removeClass(caretUp);
      mainLinks.find("span").addClass(caretDown);

      // $(".caret.caret-img").css("background-image").replace(/\"/g, "") == "url(" +settings.caretArrows[0].downUrl+ ")"

      // Icon Caret toggling
      if (mainLinksDataAttribute[i] == iDofSubMenus[findPositionOfSubmenus] && !$(subMenu[findPositionOfSubmenus]).hasClass("active")) {
        subMenu.removeClass("active");
        $(subMenu[findPositionOfSubmenus]).addClass("active");

        $(this).find("span").removeClass(caretDown);
        $(this).find("span").addClass(caretUp);
      } else {
        $(subMenu[findPositionOfSubmenus]).removeClass("active");

        $(this).find("span").removeClass(caretUp);
        $(this).find("span").addClass(caretDown);
      }

      // Sets every links default behavour for image caret except currently clicked
      if ($(".menu-dropdown").find(".menu-item-wrapper").hasClass("active")) {
        $(".mega-menu span.caret").addClass("down");
        $(".mega-menu span.caret").css({"background-image" : "url(" +settings.caretArrows[0].downUrl+ ")"});
      }

      // Image caret toggling
      if (imageCaret.hasClass("down")) {
        imageCaret.removeClass("down");
        imageCaret.addClass("up");
        imageCaret.css({"background-image" : "url(" +settings.caretArrows[0].upUrl+ ")"});
        // console.log(imageCaret[0].className);
      } else {
        imageCaret.removeClass("up");
        imageCaret.addClass("down");
        imageCaret.css({"background-image" : "url(" +settings.caretArrows[0].downUrl+ ")"});
        // console.log(imageCaret[0].className);
      }

      // Active link Highlight
      if (mainLinks.find("span").hasClass("caret-up") || $(this).find("span").hasClass("up") && !$(this).hasClass("highlight") ) {
        $(this).addClass("highlight");

        // Changing Highlight Color
        $(this).css({"border-color": settings.highlightColor});
      }

      // Normal Dropdown Positioning
      if (subMenu.hasClass("dropdown") ) {
        var dropDownforClickedLink = $("#"+iDofSubMenus[findPositionOfSubmenus]+".dropdown");
        dropDownforClickedLink.css({"left": $(this).offset().left })
      }
    });
  });

  // Submenu nested toggle
  $(".toggle-submenu-dropdown--js").on("click", function() {
    // $(this).parent().css({"position": "relative"});
    var isActiveSubmenu = $(this).hasClass("active");

    $(".submenu-dropdown").removeClass("active");
    $(".toggle-submenu-dropdown--js").removeClass("active");

    if (isActiveSubmenu) {
      $(this).removeClass("active");
      $(this).siblings().removeClass("active");
    } else {
      $(this).addClass("active");
      $(this).siblings().addClass("active");
    }
  });

  // Submenu nested close
  $(".submenu-dropdown-close--js").on("click", function() {
    console.log($(this).parents(".category-wrapper").children(".toggle-submenu-dropdown--js"));
    $(this).parents(".category-wrapper").children(".toggle-submenu-dropdown--js").click();
  });

  // While Mouse Unhover
  $(".main-links ul").each(function(){
    $(this).mouseleave(function(){
      $(".main-links ul").removeClass("follow-highlighter-enabled");
      $(".follow-highlighter").css({"display": "none", "left" : $(mainLinks[0]).offset().left});
    })
  })

  // If no need of highighter
  if (settings.highlighter === false) {
    $(".main-links").addClass("disable-highlighter");
    $(".follow-highlighter").remove();
  }

  // If Text Highlighter Set to true
  if (settings.textHighlighter === true) {
    $(".main-links").addClass("text-highlighter");
  }

  // Text Highlighter Color
  if (settings.textHighlighterColor) {
    $("style").append(`.mega-menu .text-highlighter.main-links ul li a:hover{
      color:` + settings.textHighlighterColor +
    `}`);
  }

  // Get menus IDs
  subMenu.each(function(i){
    iDofSubMenus.push($(subMenu[i]).attr("id"));
  });

  // Add Animations
  if (settings.animation === true) {
    subMenu.addClass(settings.animationClass);
  }

  // Mobile Nav icon
  $(".mobile-nav-icon a").click(function(){
    $(".follow-highlighter").remove();
    if ($(".main-links").hasClass("active")) {
      $(".main-links").removeClass("active");
      $(".menu-dropdown").hide();
    }
    else {
      $(".main-links").addClass("active");
      $(".menu-dropdown").show();
    }
  });


  // Responsive options
  if ($(window).width() < 768) {
    // Get main-links marging top as height of mobile-nav-icon
    if ($(".mega-menu").hasClass("sticky-header")) {
      $(".mega-menu").addClass("responsive-menu");
      $(".main-links").css({"margin-top": $("#mobile-menu .mobile-nav-icon").outerHeight()+"px"});
    }
  } else {
    $(".main-links").css({"margin-top": "0px"});
  }

  $(document).ready(function(){
    $(".back-link").on('click', function(){
      mainLinks.trigger('click');
      $(mainLinks[mainLinks.length - 1]).trigger('click');
    });
  })
};

$(".mega-menu").megaMenu({
  // menuBehaviour: "mouseover",
  // stickyHeader:false,
  // caret:true,
  // highlighter:false,
  caretArrows: [{
    // up:"fa fa-angle-up",
    // down:"fa fa-angle-down",
    // upUrl: "https://cdn1.iconfinder.com/data/icons/outline-17/16/caret-up-512.png",
    // downUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEX///9ERER6eno+Pj44ODg/Pz81NTUyMjKtra3d3d3v7+/IyMjg4OBaWlr7+/tXV1eQkJBycnJISEguLi6Li4tsbGxPT0/Ly8vu7u6wsLCTk5O+vr4hISFRUVH/OnzXAAADLUlEQVR4nO3ci1LiQBCF4RES0IAooFzc9f1fcy3Lddy1GZMw3T2T+r8nSFcIh9MDhAAAAAAAAAAAAAAAAAAAAAAAAICRzttZKbZnlQk3h2ZehuawUZkwrJc3ZViudQYM4XbhPdu7xa3WgCFs597TvZlv9QYMnfd07zrFCcPR/1FcHjUHDOGxcR6wedIdMGweWtcB2weloIjufG9ic6c9oHNkaAZF5BgZqkERdX6v04VqUERukaEdFNGLz11sXqwGDJt7j8ho79WDIlp7vJ8u1BqF5Nb+UVyaBEVkHhlGQRGdjAe8uTkZTxhWto/iYmU9oHHLaB7tBwzh1S4y2lePAS0XU3qrp7Sz1aO40FmP9jCziYz5zGvA0Nk8ia1Ro5Ac9wYD7s0ahcQgMnyC4pN+yzBtFBL1xZTF6ilNeTFls3pKU20Z5o1ConuW4RgU0Urv09vSoVFI1BZThqunNK3IcA+KaK3z0Wbv1CgkKosp69VTmkLLcGwUktMu+4Q789VTWvbIKCUooswtw7lRiLIef7cP3uMIsrYM/0YhydgySmgUkmwto4hGIcm2mPJcPaWt8nx62xcXFFGWllFMo5DkaBkFNQpJhsgoMyiiq1tGWY1CcmVkFBsUUbe75lFsd8UGRXTV8bfHYfZwV7SMEhuFZHTLKLJRSEYff3sdZg83MjLKD4po1GKqsNVTWjdmMVVDUEQjWkbJjULyNDQy1H9Hkd3AltHee1/wYHfD3mzmhTcKyaDFVKmrp7QBLaOCRiEZsJgqd/WU1vsso7wzir56toxaGoWkV2RUGBRRr99l2P6OIrceLaOmRiH5MTIqDYrop8VUFauntB8WU3WsntKSLaO+RiE5XH6dtgfvi8tiffkmNlUHRXSxZdTZKCQXIqP6oIgufcm2+qCIxMVUbaunNKFl1NwoBN+Pvws/zB7u22KqxtVT2n+RMZ2giJ6/3sX5s/flKPg3MiYUFNGXljGFRiH5jIyJBUX09z+mDP7rycvH8Xc9h9nDvS+mal89pb21jAk1Ckm3m8DqKW31e6JBEf3yvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwPX+AOpkK+wFenxFAAAAAElFTkSuQmCC"
  }],
  highlightColor:"skyblue",
  animation:true,
  animationClass:"animated fadeIn",
  followingHighlighter:true,
  // textHighlighter: true,
  // textHighlighterColor:"skyblue",
})
