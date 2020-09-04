//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
//-------- -------- -------- --------
//-------- js custom start
//-------- -------- -------- --------
function initScrollClass() {
    var body = jQuery("body:not(.admin-bar)"), win = jQuery(window);
    win.scrollTop();
    win.on("scroll resize orentationchange", function() {
        50 < win.scrollTop() ? body.addClass("page-scrolled") : body.removeClass("page-scrolled");
    });
}

function initSmartMenu() {
    jQuery(".nav > ul").smartmenus({
        collapsibleBehavior: "accordion",
        mainMenuSubOffsetY: 5,
        subMenusMinWidth: "8em"
    }), jQuery(".secondary-menu > ul").smartmenus({
        collapsibleBehavior: "accordion",
        mainMenuSubOffsetY: 5,
        subMenusMinWidth: "8em"
    });
}

// mobile menu init
function initMobileNav() {
    jQuery("body").mobileNav({
        menuActiveClass: "nav-active",
        menuOpener: ".nav-opener"
    }), "ontouchstart" in document.documentElement || jQuery(window).on("resize orientationchange", function() {
        jQuery("body").removeClass("nav-active"), $.SmartMenus.hideAll();
    });
}

// initialize custom form elements
function initCustomForms() {     
  //  jcf.setOptions("Select", {         wrapNative: "false"    }), jcf.replaceAll();
}

function initAnimateOnScroll() {
    AOS.init({
        startEvent: "DOMContentLoaded",
        initClassName: "aos-init",
        disable: "phone",
        debounceDelay: 50,
        throttleDelay: 99,
        offset: 50,
        delay: 0,
        once: !0,
        duration: 600,
        easing: "ease"
    });
}

//-------- -------- -------- --------
//-------- js custom end
//-------- -------- -------- --------
jQuery(function() {
    initScrollClass(), initSmartMenu(), initMobileNav(), initCustomForms();
}), jQuery(window).on("load", function() {
    jQuery("html").addClass("page--loaded"), initAnimateOnScroll();
}), function(root, factory) {
    "use strict";
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : "object" == typeof exports ? module.exports = factory(require("jquery")) : root.jcf = factory(jQuery);
}(this, function($) {
    "use strict";
    // define version
        var customInstances = [], commonOptions = {
        optionsKey: "jcf",
        dataKey: "jcf-instance",
        rtlClass: "jcf-rtl",
        focusClass: "jcf-focus",
        pressedClass: "jcf-pressed",
        disabledClass: "jcf-disabled",
        hiddenClass: "jcf-hidden",
        resetAppearanceClass: "jcf-reset-appearance",
        unselectableClass: "jcf-unselectable"
    }, isTouchDevice = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
    // private variables
        commonOptions.isMobileDevice = !(!isTouchDevice && !isWinPhoneDevice);
    var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
    isIOS = isIOS && parseFloat(isIOS[2].replace(/_/g, ".")), commonOptions.ios = isIOS;
    // simplified pointer events handler
    !function() {
        var eventList, pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled, touchEventsSupported = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, eventMap = {};
        // detect events to attach
                eventList = pointerEventsSupported ? {
            pointerover: navigator.pointerEnabled ? "pointerover" : "MSPointerOver",
            pointerdown: navigator.pointerEnabled ? "pointerdown" : "MSPointerDown",
            pointermove: navigator.pointerEnabled ? "pointermove" : "MSPointerMove",
            pointerup: navigator.pointerEnabled ? "pointerup" : "MSPointerUp"
        } : {
            pointerover: "mouseover",
            pointerdown: "mousedown" + (touchEventsSupported ? " touchstart" : ""),
            pointermove: "mousemove" + (touchEventsSupported ? " touchmove" : ""),
            pointerup: "mouseup" + (touchEventsSupported ? " touchend" : "")
        }, 
        // create event map
        $.each(eventList, function(targetEventName, fakeEventList) {
            $.each(fakeEventList.split(" "), function(index, fakeEventName) {
                eventMap[fakeEventName] = targetEventName;
            });
        }), 
        // jQuery event hooks
        $.each(eventList, function(eventName, eventHandlers) {
            eventHandlers = eventHandlers.split(" "), $.event.special["jcf-" + eventName] = {
                setup: function() {
                    var self = this;
                    $.each(eventHandlers, function(index, fallbackEvent) {
                        self.addEventListener ? self.addEventListener(fallbackEvent, fixEvent, !1) : self["on" + fallbackEvent] = fixEvent;
                    });
                },
                teardown: function() {
                    var self = this;
                    $.each(eventHandlers, function(index, fallbackEvent) {
                        self.addEventListener ? self.removeEventListener(fallbackEvent, fixEvent, !1) : self["on" + fallbackEvent] = null;
                    });
                }
            };
        });
        // check that mouse event are not simulated by mobile browsers
        var lastTouch = null, fixEvent = function(e) {
            var origEvent = e || window.event, touchEventData = null, targetEventName = eventMap[origEvent.type];
            if ((e = $.event.fix(origEvent)).type = "jcf-" + targetEventName, origEvent.pointerType) switch (origEvent.pointerType) {
              case 2:
                e.pointerType = "touch";
                break;

              case 3:
                e.pointerType = "pen";
                break;

              case 4:
                e.pointerType = "mouse";
                break;

              default:
                e.pointerType = origEvent.pointerType;
            } else e.pointerType = origEvent.type.substr(0, 5);
 // "mouse" or "touch" word length
                        return e.pageX || e.pageY || (touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent, 
            e.pageX = touchEventData.pageX, e.pageY = touchEventData.pageY), "touchend" === origEvent.type && (lastTouch = {
                x: e.pageX,
                y: e.pageY
            }), "mouse" === e.pointerType && lastTouch && function(e) {
                var dx = Math.abs(e.pageX - lastTouch.x), dy = Math.abs(e.pageY - lastTouch.y);
                if (dx <= 25 && dy <= 25) return !0;
            }(e) ? void 0 : ($.event.dispatch || $.event.handle).call(this, e);
        };
    }(), 
    // custom mousewheel/trackpad handler
    function() {
        var wheelEvents = ("onwheel" in document || 9 <= document.documentMode ? "wheel" : "mousewheel DOMMouseScroll").split(" ");
        $.event.special["jcf-mousewheel"] = {
            setup: function() {
                var self = this;
                $.each(wheelEvents, function(index, fallbackEvent) {
                    self.addEventListener ? self.addEventListener(fallbackEvent, fixEvent, !1) : self["on" + fallbackEvent] = fixEvent;
                });
            },
            teardown: function() {
                var self = this;
                $.each(wheelEvents, function(index, fallbackEvent) {
                    self.addEventListener ? self.removeEventListener(fallbackEvent, fixEvent, !1) : self["on" + fallbackEvent] = null;
                });
            }
        };
        var fixEvent = function(e) {
            var origEvent = e || window.event;
            if ((e = $.event.fix(origEvent)).type = "jcf-mousewheel", 
            // old wheel events handler
            "detail" in origEvent && (e.deltaY = -origEvent.detail), "wheelDelta" in origEvent && (e.deltaY = -origEvent.wheelDelta), 
            "wheelDeltaY" in origEvent && (e.deltaY = -origEvent.wheelDeltaY), "wheelDeltaX" in origEvent && (e.deltaX = -origEvent.wheelDeltaX), 
            // modern wheel event handler
            "deltaY" in origEvent && (e.deltaY = origEvent.deltaY), "deltaX" in origEvent && (e.deltaX = origEvent.deltaX), 
            // handle deltaMode for mouse wheel
            e.delta = e.deltaY || e.deltaX, 1 === origEvent.deltaMode) {
                e.delta *= 16, e.deltaY *= 16, e.deltaX *= 16;
            }
            return ($.event.dispatch || $.event.handle).call(this, e);
        };
    }();
    // extra module methods
    var moduleMixin = {
        // provide function for firing native events
        fireNativeEvent: function(elements, eventName) {
            $(elements).each(function() {
                var eventObject;
                this.dispatchEvent ? ((eventObject = document.createEvent("HTMLEvents")).initEvent(eventName, !0, !0), 
                this.dispatchEvent(eventObject)) : document.createEventObject && ((eventObject = document.createEventObject()).target = this).fireEvent("on" + eventName, eventObject);
            });
        },
        // bind event handlers for module instance (functions beggining with "on")
        bindHandlers: function() {
            var self = this;
            $.each(self, function(propName, propValue) {
                0 === propName.indexOf("on") && $.isFunction(propValue) && (
                // dont use $.proxy here because it doesn't create unique handler
                self[propName] = function() {
                    return propValue.apply(self, arguments);
                });
            });
        }
    }, api = {
        version: "1.1.3",
        modules: {},
        getOptions: function() {
            return $.extend({}, commonOptions);
        },
        setOptions: function(moduleName, moduleOptions) {
            1 < arguments.length ? 
            // set module options
            this.modules[moduleName] && $.extend(this.modules[moduleName].prototype.options, moduleOptions) : 
            // set common options
            $.extend(commonOptions, moduleName);
        },
        addModule: function(proto) {
            function Module(options) {
                // save instance to collection
                options.element.data(commonOptions.dataKey) || options.element.data(commonOptions.dataKey, this), 
                customInstances.push(this), 
                // save options
                this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options), 
                // bind event handlers to instance
                this.bindHandlers(), 
                // call constructor
                this.init.apply(this, arguments);
            }
            // add module to list
            var getInlineOptions = function(element) {
                var dataOptions = element.data(commonOptions.optionsKey), attrOptions = element.attr(commonOptions.optionsKey);
                if (dataOptions) return dataOptions;
                if (attrOptions) try {
                    return $.parseJSON(attrOptions);
                } catch (e) {
                    // ignore invalid attributes
                }
            };
            // parse options from HTML attribute
                        // set proto as prototype for new module
            Module.prototype = proto, 
            // add mixin methods to module proto
            $.extend(proto, moduleMixin), proto.plugins && $.each(proto.plugins, function(pluginName, plugin) {
                $.extend(plugin.prototype, moduleMixin);
            });
            // override destroy method
            var originalDestroy = Module.prototype.destroy;
            Module.prototype.destroy = function() {
                this.options.element.removeData(this.options.dataKey);
                for (var i = customInstances.length - 1; 0 <= i; i--) if (customInstances[i] === this) {
                    customInstances.splice(i, 1);
                    break;
                }
                originalDestroy && originalDestroy.apply(this, arguments);
            }, 
            // save module to list
            this.modules[proto.name] = Module;
        },
        getInstance: function(element) {
            return $(element).data(commonOptions.dataKey);
        },
        replace: function(elements, moduleName, customOptions) {
            var instance, self = this;
            return commonOptions.styleSheetCreated || function() {
                function addCSSRule(selector, rules, index) {
                    styleSheet.insertRule ? styleSheet.insertRule(selector + "{" + rules + "}", index) : styleSheet.addRule(selector, rules, index);
                }
                var styleTag = $("<style>").appendTo("head"), styleSheet = styleTag.prop("sheet") || styleTag.prop("styleSheet");
                // crossbrowser style handling
                                // add special rules
                addCSSRule("." + commonOptions.hiddenClass, "position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none"), 
                addCSSRule("." + commonOptions.rtlClass + " ." + commonOptions.hiddenClass, "right:-9999px !important; left: auto !important"), 
                addCSSRule("." + commonOptions.unselectableClass, "-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);"), 
                addCSSRule("." + commonOptions.resetAppearanceClass, "background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);");
                // detect rtl pages
                var html = $("html"), body = $("body");
                "rtl" !== html.css("direction") && "rtl" !== body.css("direction") || html.addClass(commonOptions.rtlClass), 
                // handle form reset event
                html.on("reset", function() {
                    setTimeout(function() {
                        api.refreshAll();
                    }, 0);
                }), 
                // mark stylesheet as created
                commonOptions.styleSheetCreated = !0;
            }(), $(elements).each(function() {
                var moduleOptions, element = $(this);
                (instance = element.data(commonOptions.dataKey)) ? instance.refresh() : (moduleName || $.each(self.modules, function(currentModuleName, module) {
                    if (module.prototype.matchElement.call(module.prototype, element)) return moduleName = currentModuleName, 
                    !1;
                }), moduleName && (moduleOptions = $.extend({
                    element: element
                }, customOptions), instance = new self.modules[moduleName](moduleOptions)));
            }), instance;
        },
        refresh: function(elements) {
            $(elements).each(function() {
                var instance = $(this).data(commonOptions.dataKey);
                instance && instance.refresh();
            });
        },
        destroy: function(elements) {
            $(elements).each(function() {
                var instance = $(this).data(commonOptions.dataKey);
                instance && instance.destroy();
            });
        },
        replaceAll: function(context) {
            var self = this;
            $.each(this.modules, function(moduleName, module) {
                $(module.prototype.selector, context).each(function() {
                    this.className.indexOf("jcf-ignore") < 0 && self.replace(this, moduleName);
                });
            });
        },
        refreshAll: function(context) {
            if (context) $.each(this.modules, function(moduleName, module) {
                $(module.prototype.selector, context).each(function() {
                    var instance = $(this).data(commonOptions.dataKey);
                    instance && instance.refresh();
                });
            }); else for (var i = customInstances.length - 1; 0 <= i; i--) customInstances[i].refresh();
        },
        destroyAll: function(context) {
            if (context) $.each(this.modules, function(moduleName, module) {
                $(module.prototype.selector, context).each(function(index, element) {
                    var instance = $(element).data(commonOptions.dataKey);
                    instance && instance.destroy();
                });
            }); else for (;customInstances.length; ) customInstances[0].destroy();
        }
    };
    // public API
        // always export API to the global window object
    return window.jcf = api;
}), function($, window) {
    "use strict";
    // combobox module
    function ComboBox(options) {
        this.options = $.extend({
            wrapNative: !0,
            wrapNativeOnMobile: !0,
            fakeDropInBody: !0,
            useCustomScroll: !0,
            flipDropToFit: !0,
            maxVisibleItems: 10,
            fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
            fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
            optionClassPrefix: "jcf-option-",
            selectClassPrefix: "jcf-select-",
            dropContentSelector: ".jcf-select-drop-content",
            selectTextSelector: ".jcf-select-text",
            dropActiveClass: "jcf-drop-active",
            flipDropClass: "jcf-drop-flipped"
        }, options), this.init();
    }
    // listbox module
    function ListBox(options) {
        this.options = $.extend({
            wrapNative: !0,
            useCustomScroll: !0,
            fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
            selectClassPrefix: "jcf-select-",
            listHolder: ".jcf-list-wrapper"
        }, options), this.init();
    }
    // options list module
    function SelectList(options) {
        this.options = $.extend({
            holder: null,
            maxVisibleItems: 10,
            selectOnClick: !0,
            useHoverClass: !1,
            useCustomScroll: !1,
            handleResize: !0,
            multipleSelectWithoutKey: !1,
            alwaysPreventMouseWheel: !1,
            indexAttribute: "data-index",
            cloneClassPrefix: "jcf-option-",
            containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
            containerSelector: ".jcf-list-content",
            captionClass: "jcf-optgroup-caption",
            disabledClass: "jcf-disabled",
            optionClass: "jcf-option",
            groupClass: "jcf-optgroup",
            hoverClass: "jcf-hover",
            selectedClass: "jcf-selected",
            scrollClass: "jcf-scroll-active"
        }, options), this.init();
    }
    jcf.addModule({
        name: "Select",
        selector: "select",
        options: {
            element: null,
            multipleCompactStyle: !1
        },
        plugins: {
            ListBox: ListBox,
            ComboBox: ComboBox,
            SelectList: SelectList
        },
        matchElement: function(element) {
            return element.is("select");
        },
        init: function() {
            this.element = $(this.options.element), this.createInstance();
        },
        isListBox: function() {
            return this.element.is("[size]:not([jcf-size]), [multiple]");
        },
        createInstance: function() {
            this.instance && this.instance.destroy(), this.isListBox() && !this.options.multipleCompactStyle ? this.instance = new ListBox(this.options) : this.instance = new ComboBox(this.options);
        },
        refresh: function() {
            this.isListBox() && this.instance instanceof ComboBox || !this.isListBox() && this.instance instanceof ListBox ? this.createInstance() : this.instance.refresh();
        },
        destroy: function() {
            this.instance.destroy();
        }
    }), $.extend(ComboBox.prototype, {
        init: function() {
            this.initStructure(), this.bindHandlers(), this.attachEvents(), this.refresh();
        },
        initStructure: function() {
            // prepare structure
            this.win = $(window), this.doc = $(document), this.realElement = $(this.options.element), 
            this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement), 
            this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector), 
            this.selectText = $("<span></span>").appendTo(this.selectTextContainer), makeUnselectable(this.fakeElement), 
            // copy classes from original select
            this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop("className"), this.options.selectClassPrefix)), 
            // handle compact multiple style
            this.realElement.prop("multiple") && this.fakeElement.addClass("jcf-compact-multiple"), 
            // detect device type and dropdown behavior
            this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative && (this.options.wrapNative = !0), 
            this.options.wrapNative ? 
            // wrap native select inside fake block
            this.realElement.prependTo(this.fakeElement).css({
                position: "absolute",
                height: "100%",
                width: "100%"
            }).addClass(this.options.resetAppearanceClass) : (
            // just hide native select
            this.realElement.addClass(this.options.hiddenClass), this.fakeElement.attr("title", this.realElement.attr("title")), 
            this.fakeDropTarget = this.options.fakeDropInBody ? $("body") : this.fakeElement);
        },
        attachEvents: function() {
            // delayed refresh handler
            var self = this;
            this.delayedRefresh = function() {
                setTimeout(function() {
                    self.refresh(), self.list && (self.list.refresh(), self.list.scrollToActiveOption());
                }, 1);
            }, 
            // native dropdown event handlers
            this.options.wrapNative ? this.realElement.on({
                focus: this.onFocus,
                change: this.onChange,
                click: this.onChange,
                keydown: this.onChange
            }) : (
            // custom dropdown event handlers
            this.realElement.on({
                focus: this.onFocus,
                change: this.onChange,
                keydown: this.onKeyDown
            }), this.fakeElement.on({
                "jcf-pointerdown": this.onSelectAreaPress
            }));
        },
        onKeyDown: function(e) {
            13 === e.which ? this.toggleDropdown() : this.dropActive && this.delayedRefresh();
        },
        onChange: function() {
            this.refresh();
        },
        onFocus: function() {
            this.pressedFlag && this.focusedFlag || (this.fakeElement.addClass(this.options.focusClass), 
            this.realElement.on("blur", this.onBlur), this.toggleListMode(!0), this.focusedFlag = !0);
        },
        onBlur: function() {
            this.pressedFlag || (this.fakeElement.removeClass(this.options.focusClass), this.realElement.off("blur", this.onBlur), 
            this.toggleListMode(!1), this.focusedFlag = !1);
        },
        onResize: function() {
            this.dropActive && this.hideDropdown();
        },
        onSelectDropPress: function() {
            this.pressedFlag = !0;
        },
        onSelectDropRelease: function(e, pointerEvent) {
            this.pressedFlag = !1, "mouse" === pointerEvent.pointerType && this.realElement.focus();
        },
        onSelectAreaPress: function(e) {
            !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length || 1 < e.button || this.realElement.is(":disabled") || (
            // toggle dropdown visibility
            this.selectOpenedByEvent = e.pointerType, this.toggleDropdown(), 
            // misc handlers
            this.focusedFlag || ("mouse" === e.pointerType ? this.realElement.focus() : this.onFocus(e)), 
            this.pressedFlag = !0, this.fakeElement.addClass(this.options.pressedClass), this.doc.on("jcf-pointerup", this.onSelectAreaRelease));
        },
        onSelectAreaRelease: function(e) {
            this.focusedFlag && "mouse" === e.pointerType && this.realElement.focus(), this.pressedFlag = !1, 
            this.fakeElement.removeClass(this.options.pressedClass), this.doc.off("jcf-pointerup", this.onSelectAreaRelease);
        },
        onOutsideClick: function(e) {
            var target = $(e.target);
            target.closest(this.fakeElement).length || target.closest(this.dropdown).length || this.hideDropdown();
        },
        onSelect: function() {
            this.refresh(), this.realElement.prop("multiple") ? this.repositionDropdown() : this.hideDropdown(), 
            this.fireNativeEvent(this.realElement, "change");
        },
        toggleListMode: function(state) {
            this.options.wrapNative || (state ? 
            // temporary change select to list to avoid appearing of native dropdown
            this.realElement.attr({
                size: 4,
                "jcf-size": ""
            }) : 
            // restore select from list mode to dropdown select
            this.options.wrapNative || this.realElement.removeAttr("size jcf-size"));
        },
        createDropdown: function() {
            // destroy previous dropdown if needed
            this.dropdown && (this.list.destroy(), this.dropdown.remove()), 
            // create new drop container
            this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget), 
            this.dropdown.addClass(getPrefixedClasses(this.realElement.prop("className"), this.options.selectClassPrefix)), 
            makeUnselectable(this.dropdown), 
            // handle compact multiple style
            this.realElement.prop("multiple") && this.dropdown.addClass("jcf-compact-multiple"), 
            // set initial styles for dropdown in body
            this.options.fakeDropInBody && this.dropdown.css({
                position: "absolute",
                top: -9999
            }), 
            // create new select list instance
            this.list = new SelectList({
                useHoverClass: !0,
                handleResize: !1,
                alwaysPreventMouseWheel: !0,
                maxVisibleItems: this.options.maxVisibleItems,
                useCustomScroll: this.options.useCustomScroll,
                holder: this.dropdown.find(this.options.dropContentSelector),
                multipleSelectWithoutKey: this.realElement.prop("multiple"),
                element: this.realElement
            }), $(this.list).on({
                select: this.onSelect,
                press: this.onSelectDropPress,
                release: this.onSelectDropRelease
            });
        },
        repositionDropdown: function() {
            var calcTop, calcLeft, bodyOffset, selectOffset = this.fakeElement.offset(), selectWidth = this.fakeElement.outerWidth(), selectHeight = this.fakeElement.outerHeight(), dropHeight = this.dropdown.css("width", selectWidth).outerHeight(), winScrollTop = this.win.scrollTop(), winHeight = this.win.height(), needFlipDrop = !1;
            // check flip drop position
                        selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop && (needFlipDrop = !0), 
            this.options.fakeDropInBody && (bodyOffset = "static" !== this.fakeDropTarget.css("position") ? this.fakeDropTarget.offset().top : 0, 
            calcTop = this.options.flipDropToFit && needFlipDrop ? (
            // calculate flipped dropdown position
            calcLeft = selectOffset.left, selectOffset.top - dropHeight - bodyOffset) : (
            // calculate default drop position
            calcLeft = selectOffset.left, selectOffset.top + selectHeight - bodyOffset), 
            // update drop styles
            this.dropdown.css({
                width: selectWidth,
                left: calcLeft,
                top: calcTop
            })), 
            // refresh flipped class
            this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
        },
        showDropdown: function() {
            // do not show empty custom dropdown
            this.realElement.prop("options").length && (
            // create options list if not created
            this.dropdown || this.createDropdown(), 
            // show dropdown
            this.dropActive = !0, this.dropdown.appendTo(this.fakeDropTarget), this.fakeElement.addClass(this.options.dropActiveClass), 
            this.refreshSelectedText(), this.repositionDropdown(), this.list.setScrollTop(this.savedScrollTop), 
            this.list.refresh(), 
            // add temporary event handlers
            this.win.on("resize", this.onResize), this.doc.on("jcf-pointerdown", this.onOutsideClick));
        },
        hideDropdown: function() {
            this.dropdown && (this.savedScrollTop = this.list.getScrollTop(), this.fakeElement.removeClass(this.options.dropActiveClass + " " + this.options.flipDropClass), 
            this.dropdown.removeClass(this.options.flipDropClass).detach(), this.doc.off("jcf-pointerdown", this.onOutsideClick), 
            this.win.off("resize", this.onResize), this.dropActive = !1, "touch" === this.selectOpenedByEvent && this.onBlur());
        },
        toggleDropdown: function() {
            this.dropActive ? this.hideDropdown() : this.showDropdown();
        },
        refreshSelectedText: function() {
            // redraw selected area
            var selectedOptionClasses, selectedIndex = this.realElement.prop("selectedIndex"), selectedOption = this.realElement.prop("options")[selectedIndex], selectedOptionImage = selectedOption ? selectedOption.getAttribute("data-image") : null, selectedOptionText = "";
            this.realElement.prop("multiple") ? ($.each(this.realElement.prop("options"), function(index, option) {
                option.selected && (selectedOptionText += (selectedOptionText ? ", " : "") + option.innerHTML);
            }), selectedOptionText = selectedOptionText || (this.realElement.attr("placeholder") || ""), 
            this.selectText.removeAttr("class").html(selectedOptionText)) : selectedOption ? this.currentSelectedText === selectedOption.innerHTML && this.currentSelectedImage === selectedOptionImage || (selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix), 
            this.selectText.attr("class", selectedOptionClasses).html(selectedOption.innerHTML), 
            selectedOptionImage ? (this.selectImage || (this.selectImage = $("<img>").prependTo(this.selectTextContainer).hide()), 
            this.selectImage.attr("src", selectedOptionImage).show()) : this.selectImage && this.selectImage.hide(), 
            this.currentSelectedText = selectedOption.innerHTML, this.currentSelectedImage = selectedOptionImage) : (this.selectImage && this.selectImage.hide(), 
            this.selectText.removeAttr("class").empty());
        },
        refresh: function() {
            // refresh fake select visibility
            "none" === this.realElement.prop("style").display ? this.fakeElement.hide() : this.fakeElement.show(), 
            // refresh selected text
            this.refreshSelectedText(), 
            // handle disabled state
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(":disabled"));
        },
        destroy: function() {
            // restore structure
            this.options.wrapNative ? this.realElement.insertBefore(this.fakeElement).css({
                position: "",
                height: "",
                width: ""
            }).removeClass(this.options.resetAppearanceClass) : (this.realElement.removeClass(this.options.hiddenClass), 
            this.realElement.is("[jcf-size]") && this.realElement.removeAttr("size jcf-size")), 
            // removing element will also remove its event handlers
            this.fakeElement.remove(), 
            // remove other event handlers
            this.doc.off("jcf-pointerup", this.onSelectAreaRelease), this.realElement.off({
                focus: this.onFocus
            });
        }
    }), $.extend(ListBox.prototype, {
        init: function() {
            this.bindHandlers(), this.initStructure(), this.attachEvents();
        },
        initStructure: function() {
            this.realElement = $(this.options.element), this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement), 
            this.listHolder = this.fakeElement.find(this.options.listHolder), makeUnselectable(this.fakeElement), 
            // copy classes from original select
            this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop("className"), this.options.selectClassPrefix)), 
            this.realElement.addClass(this.options.hiddenClass), this.list = new SelectList({
                useCustomScroll: this.options.useCustomScroll,
                holder: this.listHolder,
                selectOnClick: !1,
                element: this.realElement
            });
        },
        attachEvents: function() {
            // delayed refresh handler
            var self = this;
            this.delayedRefresh = function(e) {
                e && 16 === e.which || (clearTimeout(self.refreshTimer), self.refreshTimer = setTimeout(function() {
                    self.refresh(), self.list.scrollToActiveOption();
                }, 1));
            }, 
            // other event handlers
            this.realElement.on({
                focus: this.onFocus,
                click: this.delayedRefresh,
                keydown: this.delayedRefresh
            }), 
            // select list event handlers
            $(this.list).on({
                select: this.onSelect,
                press: this.onFakeOptionsPress,
                release: this.onFakeOptionsRelease
            });
        },
        onFakeOptionsPress: function(e, pointerEvent) {
            this.pressedFlag = !0, "mouse" === pointerEvent.pointerType && this.realElement.focus();
        },
        onFakeOptionsRelease: function(e, pointerEvent) {
            this.pressedFlag = !1, "mouse" === pointerEvent.pointerType && this.realElement.focus();
        },
        onSelect: function() {
            this.fireNativeEvent(this.realElement, "change"), this.fireNativeEvent(this.realElement, "click");
        },
        onFocus: function() {
            this.pressedFlag && this.focusedFlag || (this.fakeElement.addClass(this.options.focusClass), 
            this.realElement.on("blur", this.onBlur), this.focusedFlag = !0);
        },
        onBlur: function() {
            this.pressedFlag || (this.fakeElement.removeClass(this.options.focusClass), this.realElement.off("blur", this.onBlur), 
            this.focusedFlag = !1);
        },
        refresh: function() {
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(":disabled")), 
            this.list.refresh();
        },
        destroy: function() {
            this.list.destroy(), this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass), 
            this.fakeElement.remove();
        }
    }), $.extend(SelectList.prototype, {
        init: function() {
            this.initStructure(), this.refreshSelectedClass(), this.attachEvents();
        },
        initStructure: function() {
            this.element = $(this.options.element), this.indexSelector = "[" + this.options.indexAttribute + "]", 
            this.container = $(this.options.containerStructure).appendTo(this.options.holder), 
            this.listHolder = this.container.find(this.options.containerSelector), this.lastClickedIndex = this.element.prop("selectedIndex"), 
            this.rebuildList();
        },
        attachEvents: function() {
            this.bindHandlers(), this.listHolder.on("jcf-pointerdown", this.indexSelector, this.onItemPress), 
            this.listHolder.on("jcf-pointerdown", this.onPress), this.options.useHoverClass && this.listHolder.on("jcf-pointerover", this.indexSelector, this.onHoverItem);
        },
        onPress: function(e) {
            $(this).trigger("press", e), this.listHolder.on("jcf-pointerup", this.onRelease);
        },
        onRelease: function(e) {
            $(this).trigger("release", e), this.listHolder.off("jcf-pointerup", this.onRelease);
        },
        onHoverItem: function(e) {
            var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
            this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
        },
        onItemPress: function(e) {
            "touch" === e.pointerType || this.options.selectOnClick ? (
            // select option after "click"
            this.tmpListOffsetTop = this.list.offset().top, this.listHolder.on("jcf-pointerup", this.indexSelector, this.onItemRelease)) : 
            // select option immediately
            this.onSelectItem(e);
        },
        onItemRelease: function(e) {
            // remove event handlers and temporary data
            this.listHolder.off("jcf-pointerup", this.indexSelector, this.onItemRelease), 
            // simulate item selection
            this.tmpListOffsetTop === this.list.offset().top && this.listHolder.on("click", this.indexSelector, {
                savedPointerType: e.pointerType
            }, this.onSelectItem), delete this.tmpListOffsetTop;
        },
        onSelectItem: function(e) {
            var range, clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)), pointerType = e.data && e.data.savedPointerType || e.pointerType || "mouse";
            // remove click event handler
                        this.listHolder.off("click", this.indexSelector, this.onSelectItem), 
            // ignore clicks on disabled options
            1 < e.button || this.realOptions[clickedIndex].disabled || (this.element.prop("multiple") ? e.metaKey || e.ctrlKey || "touch" === pointerType || this.options.multipleSelectWithoutKey ? 
            // if CTRL/CMD pressed or touch devices - toggle selected option
            this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected : e.shiftKey ? (
            // if SHIFT pressed - update selection
            range = [ this.lastClickedIndex, clickedIndex ].sort(function(a, b) {
                return a - b;
            }), this.realOptions.each(function(index, option) {
                option.selected = index >= range[0] && index <= range[1];
            })) : 
            // set single selected index
            this.element.prop("selectedIndex", clickedIndex) : this.element.prop("selectedIndex", clickedIndex), 
            // save last clicked option
            e.shiftKey || (this.lastClickedIndex = clickedIndex), 
            // refresh classes
            this.refreshSelectedClass(), 
            // scroll to active item in desktop browsers
            "mouse" === pointerType && this.scrollToActiveOption(), 
            // make callback when item selected
            $(this).trigger("select"));
        },
        rebuildList: function() {
            // rebuild options
            var self = this, rootElement = this.element[0];
            // recursively create fake options
                        this.storedSelectHTML = rootElement.innerHTML, this.optionIndex = 0, 
            this.list = $(this.createOptionsList(rootElement)), this.listHolder.empty().append(this.list), 
            this.realOptions = this.element.find("option"), this.fakeOptions = this.list.find(this.indexSelector), 
            this.fakeListItems = this.list.find("." + this.options.captionClass + "," + this.indexSelector), 
            delete this.optionIndex;
            // detect max visible items
            var maxCount = this.options.maxVisibleItems, sizeValue = this.element.prop("size");
            1 < sizeValue && !this.element.is("[jcf-size]") && (maxCount = sizeValue);
            // handle scrollbar
                        var needScrollBar = this.fakeOptions.length > maxCount;
            this.container.toggleClass(this.options.scrollClass, needScrollBar), needScrollBar && (
            // change max-height
            this.listHolder.css({
                maxHeight: this.getOverflowHeight(maxCount),
                overflow: "auto"
            }), this.options.useCustomScroll && jcf.modules.Scrollable) ? 
            // add custom scrollbar if specified in options
            jcf.replace(this.listHolder, "Scrollable", {
                handleResize: this.options.handleResize,
                alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
            }) : 
            // disable edge wheel scrolling
            this.options.alwaysPreventMouseWheel && (this.preventWheelHandler = function(e) {
                var currentScrollTop = self.listHolder.scrollTop(), maxScrollTop = self.listHolder.prop("scrollHeight") - self.listHolder.innerHeight();
                // check edge cases
                                (currentScrollTop <= 0 && e.deltaY < 0 || maxScrollTop <= currentScrollTop && 0 < e.deltaY) && e.preventDefault();
            }, this.listHolder.on("jcf-mousewheel", this.preventWheelHandler));
        },
        refreshSelectedClass: function() {
            var selectedItem, self = this, isMultiple = this.element.prop("multiple"), selectedIndex = this.element.prop("selectedIndex");
            isMultiple ? this.realOptions.each(function(index, option) {
                self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
            }) : (this.fakeOptions.removeClass(this.options.selectedClass + " " + this.options.hoverClass), 
            selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass), 
            this.options.useHoverClass && selectedItem.addClass(this.options.hoverClass));
        },
        scrollToActiveOption: function() {
            // scroll to target option
            var targetOffset = this.getActiveOptionOffset();
            "number" == typeof targetOffset && this.listHolder.prop("scrollTop", targetOffset);
        },
        getSelectedIndexRange: function() {
            var firstSelected = -1, lastSelected = -1;
            return this.realOptions.each(function(index, option) {
                option.selected && (firstSelected < 0 && (firstSelected = index), lastSelected = index);
            }), [ firstSelected, lastSelected ];
        },
        getChangedSelectedIndex: function() {
            var targetIndex, selectedIndex = this.element.prop("selectedIndex");
            return this.element.prop("multiple") ? (
            // multiple selects handling
            this.previousRange || (this.previousRange = [ selectedIndex, selectedIndex ]), this.currentRange = this.getSelectedIndexRange(), 
            targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1], 
            this.previousRange = this.currentRange, targetIndex) : selectedIndex;
        },
        getActiveOptionOffset: function() {
            // calc values
            var dropHeight = this.listHolder.height(), dropScrollTop = this.listHolder.prop("scrollTop"), currentIndex = this.getChangedSelectedIndex(), fakeOption = this.fakeOptions.eq(currentIndex), fakeOptionOffset = fakeOption.offset().top - this.list.offset().top, fakeOptionHeight = fakeOption.innerHeight();
            // scroll list
                        return dropScrollTop + dropHeight <= fakeOptionOffset + fakeOptionHeight ? fakeOptionOffset - dropHeight + fakeOptionHeight : fakeOptionOffset < dropScrollTop ? fakeOptionOffset : void 0;
        },
        getOverflowHeight: function(sizeValue) {
            var item = this.fakeListItems.eq(sizeValue - 1), listOffset = this.list.offset().top;
            return item.offset().top + item.innerHeight() - listOffset;
        },
        getScrollTop: function() {
            return this.listHolder.scrollTop();
        },
        setScrollTop: function(value) {
            this.listHolder.scrollTop(value);
        },
        createOption: function(option) {
            var newOption = document.createElement("span");
            newOption.className = this.options.optionClass, newOption.innerHTML = option.innerHTML, 
            newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);
            var optionImage, optionImageSrc = option.getAttribute("data-image");
            return optionImageSrc && ((optionImage = document.createElement("img")).src = optionImageSrc, 
            newOption.insertBefore(optionImage, newOption.childNodes[0])), option.disabled && (newOption.className += " " + this.options.disabledClass), 
            option.className && (newOption.className += " " + getPrefixedClasses(option.className, this.options.cloneClassPrefix)), 
            newOption;
        },
        createOptGroup: function(optgroup) {
            var optGroupCaption, optGroupList, optGroupContainer = document.createElement("span"), optGroupName = optgroup.getAttribute("label");
            // create caption
                        return (optGroupCaption = document.createElement("span")).className = this.options.captionClass, 
            optGroupCaption.innerHTML = optGroupName, optGroupContainer.appendChild(optGroupCaption), 
            // create list of options
            optgroup.children.length && (optGroupList = this.createOptionsList(optgroup), optGroupContainer.appendChild(optGroupList)), 
            optGroupContainer.className = this.options.groupClass, optGroupContainer;
        },
        createOptionContainer: function() {
            return document.createElement("li");
        },
        createOptionsList: function(container) {
            var self = this, list = document.createElement("ul");
            return $.each(container.children, function(index, currentNode) {
                var newNode, item = self.createOptionContainer(currentNode);
                switch (currentNode.tagName.toLowerCase()) {
                  case "option":
                    newNode = self.createOption(currentNode);
                    break;

                  case "optgroup":
                    newNode = self.createOptGroup(currentNode);
                }
                list.appendChild(item).appendChild(newNode);
            }), list;
        },
        refresh: function() {
            // check for select innerHTML changes
            this.storedSelectHTML !== this.element.prop("innerHTML") && this.rebuildList();
            // refresh custom scrollbar
                        var scrollInstance = jcf.getInstance(this.listHolder);
            scrollInstance && scrollInstance.refresh(), 
            // refresh selectes classes
            this.refreshSelectedClass();
        },
        destroy: function() {
            this.listHolder.off("jcf-mousewheel", this.preventWheelHandler), this.listHolder.off("jcf-pointerdown", this.indexSelector, this.onSelectItem), 
            this.listHolder.off("jcf-pointerover", this.indexSelector, this.onHoverItem), this.listHolder.off("jcf-pointerdown", this.onPress);
        }
    });
    // helper functions
    var unselectableClass, getPrefixedClasses = function(className, prefixToAdd) {
        return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + "$1 ") : "";
    }, makeUnselectable = (unselectableClass = jcf.getOptions().unselectableClass, function(node) {
        node.addClass(unselectableClass).on("selectstart", preventHandler);
    });
    function preventHandler(e) {
        e.preventDefault();
    }
}(jQuery, this), 
/*! SmartMenus jQuery Plugin - v1.1.0 - September 17, 2017
 * http://www.smartmenus.org/
 * Copyright Vasil Dinkov, Vadikom Web Ltd. http://vadikom.com; Licensed MIT */
function(t) {
    "function" == typeof define && define.amd ? define([ "jquery" ], t) : "object" == typeof module && "object" == typeof module.exports ? module.exports = t(require("jquery")) : t(jQuery);
}(function($) {
    function initMouseDetection(t) {
        var e = ".smartmenus_mouse";
        if (mouseDetectionEnabled || t) mouseDetectionEnabled && t && ($(document).off(e), 
        mouseDetectionEnabled = !1); else {
            var i = !0, s = null, o = {
                mousemove: function(t) {
                    var e = {
                        x: t.pageX,
                        y: t.pageY,
                        timeStamp: new Date().getTime()
                    };
                    if (s) {
                        var o = Math.abs(s.x - e.x), a = Math.abs(s.y - e.y);
                        if ((0 < o || 0 < a) && o <= 2 && a <= 2 && e.timeStamp - s.timeStamp <= 300 && (mouse = !0, 
                        i)) {
                            var n = $(t.target).closest("a");
                            n.is("a") && $.each(menuTrees, function() {
                                return $.contains(this.$root[0], n[0]) ? (this.itemEnter({
                                    currentTarget: n[0]
                                }), !1) : void 0;
                            }), i = !1;
                        }
                    }
                    s = e;
                }
            };
            o[touchEvents ? "touchstart" : "pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"] = function(t) {
                isTouchEvent(t.originalEvent) && (mouse = !1);
            }, $(document).on(getEventsNS(o, e)), mouseDetectionEnabled = !0;
        }
    }
    function isTouchEvent(t) {
        return !/^(4|mouse)$/.test(t.pointerType);
    }
    function getEventsNS(t, e) {
        e = e || "";
        var i = {};
        for (var s in t) i[s.split(" ").join(e + " ") + e] = t[s];
        return i;
    }
    var menuTrees = [], mouse = !1, touchEvents = "ontouchstart" in window, mouseDetectionEnabled = !1, requestAnimationFrame = window.requestAnimationFrame || function(t) {
        return setTimeout(t, 1e3 / 60);
    }, cancelAnimationFrame = window.cancelAnimationFrame || function(t) {
        clearTimeout(t);
    }, canAnimate = !!$.fn.animate;
    return $.SmartMenus = function(t, e) {
        this.$root = $(t), this.opts = e, this.rootId = "", this.accessIdPrefix = "", this.$subArrow = null, 
        this.activatedItems = [], this.visibleSubMenus = [], this.showTimeout = 0, this.hideTimeout = 0, 
        this.scrollTimeout = 0, this.clickActivated = !1, this.focusActivated = !1, this.zIndexInc = 0, 
        this.idInc = 0, this.$firstLink = null, this.$firstSub = null, this.disabled = !1, 
        this.$disableOverlay = null, this.$touchScrollingSub = null, this.cssTransforms3d = "perspective" in t.style || "webkitPerspective" in t.style, 
        this.wasCollapsible = !1, this.init();
    }, $.extend($.SmartMenus, {
        hideAll: function() {
            $.each(menuTrees, function() {
                this.menuHideAll();
            });
        },
        destroy: function() {
            for (;menuTrees.length; ) menuTrees[0].destroy();
            initMouseDetection(!0);
        },
        prototype: {
            init: function(t) {
                var e = this;
                if (!t) {
                    menuTrees.push(this), this.rootId = (new Date().getTime() + Math.random() + "").replace(/\D/g, ""), 
                    this.accessIdPrefix = "sm-" + this.rootId + "-", this.$root.hasClass("sm-rtl") && (this.opts.rightToLeftSubMenus = !0);
                    var i = ".smartmenus";
                    this.$root.data("smartmenus", this).attr("data-smartmenus-id", this.rootId).dataSM("level", 1).on(getEventsNS({
                        "mouseover focusin": $.proxy(this.rootOver, this),
                        "mouseout focusout": $.proxy(this.rootOut, this),
                        keydown: $.proxy(this.rootKeyDown, this)
                    }, i)).on(getEventsNS({
                        mouseenter: $.proxy(this.itemEnter, this),
                        mouseleave: $.proxy(this.itemLeave, this),
                        mousedown: $.proxy(this.itemDown, this),
                        focus: $.proxy(this.itemFocus, this),
                        blur: $.proxy(this.itemBlur, this),
                        click: $.proxy(this.itemClick, this)
                    }, i), "a"), i += this.rootId, this.opts.hideOnClick && $(document).on(getEventsNS({
                        touchstart: $.proxy(this.docTouchStart, this),
                        touchmove: $.proxy(this.docTouchMove, this),
                        touchend: $.proxy(this.docTouchEnd, this),
                        click: $.proxy(this.docClick, this)
                    }, i)), $(window).on(getEventsNS({
                        "resize orientationchange": $.proxy(this.winResize, this)
                    }, i)), this.opts.subIndicators && (this.$subArrow = $("<span/>").addClass("sub-arrow"), 
                    this.opts.subIndicatorsText && this.$subArrow.html(this.opts.subIndicatorsText)), 
                    initMouseDetection();
                }
                if (this.$firstSub = this.$root.find("ul").each(function() {
                    e.menuInit($(this));
                }).eq(0), this.$firstLink = this.$root.find("a").eq(0), this.opts.markCurrentItem) {
                    var s = /(index|default)\.[^#\?\/]*/i, a = window.location.href.replace(s, ""), n = a.replace(/#.*/, "");
                    this.$root.find("a").each(function() {
                        var t = this.href.replace(s, ""), i = $(this);
                        t != a && t != n || (i.addClass("current"), e.opts.markCurrentTree && i.parentsUntil("[data-smartmenus-id]", "ul").each(function() {
                            $(this).dataSM("parent-a").addClass("current");
                        }));
                    });
                }
                this.wasCollapsible = this.isCollapsible();
            },
            destroy: function(t) {
                if (!t) {
                    var e = ".smartmenus";
                    this.$root.removeData("smartmenus").removeAttr("data-smartmenus-id").removeDataSM("level").off(e), 
                    e += this.rootId, $(document).off(e), $(window).off(e), this.opts.subIndicators && (this.$subArrow = null);
                }
                this.menuHideAll();
                var i = this;
                this.$root.find("ul").each(function() {
                    var t = $(this);
                    t.dataSM("scroll-arrows") && t.dataSM("scroll-arrows").remove(), t.dataSM("shown-before") && ((i.opts.subMenusMinWidth || i.opts.subMenusMaxWidth) && t.css({
                        width: "",
                        minWidth: "",
                        maxWidth: ""
                    }).removeClass("sm-nowrap"), t.dataSM("scroll-arrows") && t.dataSM("scroll-arrows").remove(), 
                    t.css({
                        zIndex: "",
                        top: "",
                        left: "",
                        marginLeft: "",
                        marginTop: "",
                        display: ""
                    })), 0 == (t.attr("id") || "").indexOf(i.accessIdPrefix) && t.removeAttr("id");
                }).removeDataSM("in-mega").removeDataSM("shown-before").removeDataSM("scroll-arrows").removeDataSM("parent-a").removeDataSM("level").removeDataSM("beforefirstshowfired").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeAttr("aria-expanded"), 
                this.$root.find("a.has-submenu").each(function() {
                    var t = $(this);
                    0 == t.attr("id").indexOf(i.accessIdPrefix) && t.removeAttr("id");
                }).removeClass("has-submenu").removeDataSM("sub").removeAttr("aria-haspopup").removeAttr("aria-controls").removeAttr("aria-expanded").closest("li").removeDataSM("sub"), 
                this.opts.subIndicators && this.$root.find("span.sub-arrow").remove(), this.opts.markCurrentItem && this.$root.find("a.current").removeClass("current"), 
                t || (this.$root = null, this.$firstLink = null, this.$firstSub = null, this.$disableOverlay && (this.$disableOverlay.remove(), 
                this.$disableOverlay = null), menuTrees.splice($.inArray(this, menuTrees), 1));
            },
            disable: function(t) {
                if (!this.disabled) {
                    if (this.menuHideAll(), !t && !this.opts.isPopup && this.$root.is(":visible")) {
                        var e = this.$root.offset();
                        this.$disableOverlay = $('<div class="sm-jquery-disable-overlay"/>').css({
                            position: "absolute",
                            top: e.top,
                            left: e.left,
                            width: this.$root.outerWidth(),
                            height: this.$root.outerHeight(),
                            zIndex: this.getStartZIndex(!0),
                            opacity: 0
                        }).appendTo(document.body);
                    }
                    this.disabled = !0;
                }
            },
            docClick: function(t) {
                return this.$touchScrollingSub ? void (this.$touchScrollingSub = null) : void ((this.visibleSubMenus.length && !$.contains(this.$root[0], t.target) || $(t.target).closest("a").length) && this.menuHideAll());
            },
            docTouchEnd: function() {
                if (this.lastTouch) {
                    if (!(!this.visibleSubMenus.length || void 0 !== this.lastTouch.x2 && this.lastTouch.x1 != this.lastTouch.x2 || void 0 !== this.lastTouch.y2 && this.lastTouch.y1 != this.lastTouch.y2 || this.lastTouch.target && $.contains(this.$root[0], this.lastTouch.target))) {
                        this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = 0);
                        var t = this;
                        this.hideTimeout = setTimeout(function() {
                            t.menuHideAll();
                        }, 350);
                    }
                    this.lastTouch = null;
                }
            },
            docTouchMove: function(t) {
                if (this.lastTouch) {
                    var e = t.originalEvent.touches[0];
                    this.lastTouch.x2 = e.pageX, this.lastTouch.y2 = e.pageY;
                }
            },
            docTouchStart: function(t) {
                var e = t.originalEvent.touches[0];
                this.lastTouch = {
                    x1: e.pageX,
                    y1: e.pageY,
                    target: e.target
                };
            },
            enable: function() {
                this.disabled && (this.$disableOverlay && (this.$disableOverlay.remove(), this.$disableOverlay = null), 
                this.disabled = !1);
            },
            getClosestMenu: function(t) {
                for (var e = $(t).closest("ul"); e.dataSM("in-mega"); ) e = e.parent().closest("ul");
                return e[0] || null;
            },
            getHeight: function(t) {
                return this.getOffset(t, !0);
            },
            getOffset: function(t, e) {
                var i;
                "none" == t.css("display") && (i = {
                    position: t[0].style.position,
                    visibility: t[0].style.visibility
                }, t.css({
                    position: "absolute",
                    visibility: "hidden"
                }).show());
                var s = t[0].getBoundingClientRect && t[0].getBoundingClientRect(), o = s && (e ? s.height || s.bottom - s.top : s.width || s.right - s.left);
                return o || 0 === o || (o = e ? t[0].offsetHeight : t[0].offsetWidth), i && t.hide().css(i), 
                o;
            },
            getStartZIndex: function(t) {
                var e = parseInt(this[t ? "$root" : "$firstSub"].css("z-index"));
                return !t && isNaN(e) && (e = parseInt(this.$root.css("z-index"))), isNaN(e) ? 1 : e;
            },
            getTouchPoint: function(t) {
                return t.touches && t.touches[0] || t.changedTouches && t.changedTouches[0] || t;
            },
            getViewport: function(t) {
                var e = t ? "Height" : "Width", i = document.documentElement["client" + e], s = window["inner" + e];
                return s && (i = Math.min(i, s)), i;
            },
            getViewportHeight: function() {
                return this.getViewport(!0);
            },
            getViewportWidth: function() {
                return this.getViewport();
            },
            getWidth: function(t) {
                return this.getOffset(t);
            },
            handleEvents: function() {
                return !this.disabled && this.isCSSOn();
            },
            handleItemEvents: function(t) {
                return this.handleEvents() && !this.isLinkInMegaMenu(t);
            },
            isCollapsible: function() {
                return "static" == this.$firstSub.css("position");
            },
            isCSSOn: function() {
                return "inline" != this.$firstLink.css("display");
            },
            isFixed: function() {
                var t = "fixed" == this.$root.css("position");
                return t || this.$root.parentsUntil("body").each(function() {
                    return "fixed" == $(this).css("position") ? !(t = !0) : void 0;
                }), t;
            },
            isLinkInMegaMenu: function(t) {
                return $(this.getClosestMenu(t[0])).hasClass("mega-menu");
            },
            isTouchMode: function() {
                return !mouse || this.opts.noMouseOver || this.isCollapsible();
            },
            itemActivate: function(t, e) {
                var i = t.closest("ul"), s = i.dataSM("level");
                if (1 < s && (!this.activatedItems[s - 2] || this.activatedItems[s - 2][0] != i.dataSM("parent-a")[0])) {
                    var o = this;
                    $(i.parentsUntil("[data-smartmenus-id]", "ul").get().reverse()).add(i).each(function() {
                        o.itemActivate($(this).dataSM("parent-a"));
                    });
                }
                if (this.isCollapsible() && !e || this.menuHideSubMenus(this.activatedItems[s - 1] && this.activatedItems[s - 1][0] == t[0] ? s : s - 1), 
                this.activatedItems[s - 1] = t, !1 !== this.$root.triggerHandler("activate.smapi", t[0])) {
                    var a = t.dataSM("sub");
                    a && (this.isTouchMode() || !this.opts.showOnClick || this.clickActivated) && this.menuShow(a);
                }
            },
            itemBlur: function(t) {
                var e = $(t.currentTarget);
                this.handleItemEvents(e) && this.$root.triggerHandler("blur.smapi", e[0]);
            },
            itemClick: function(t) {
                var e = $(t.currentTarget);
                if (this.handleItemEvents(e)) {
                    if (this.$touchScrollingSub && this.$touchScrollingSub[0] == e.closest("ul")[0]) return this.$touchScrollingSub = null, 
                    t.stopPropagation(), !1;
                    if (!1 === this.$root.triggerHandler("click.smapi", e[0])) return !1;
                    var i = $(t.target).is(".sub-arrow"), s = e.dataSM("sub"), o = !!s && 2 == s.dataSM("level"), a = this.isCollapsible(), n = /toggle$/.test(this.opts.collapsibleBehavior), r = /link$/.test(this.opts.collapsibleBehavior), h = /^accordion/.test(this.opts.collapsibleBehavior);
                    if (s && !s.is(":visible")) {
                        if ((!r || !a || i) && (this.opts.showOnClick && o && (this.clickActivated = !0), 
                        this.itemActivate(e, h), s.is(":visible"))) return !(this.focusActivated = !0);
                    } else if (a && (n || i)) return this.itemActivate(e, h), this.menuHide(s), n && (this.focusActivated = !1), 
                    !1;
                    return !(this.opts.showOnClick && o || e.hasClass("disabled") || !1 === this.$root.triggerHandler("select.smapi", e[0])) && void 0;
                }
            },
            itemDown: function(t) {
                var e = $(t.currentTarget);
                this.handleItemEvents(e) && e.dataSM("mousedown", !0);
            },
            itemEnter: function(t) {
                var e = $(t.currentTarget);
                if (this.handleItemEvents(e)) {
                    if (!this.isTouchMode()) {
                        this.showTimeout && (clearTimeout(this.showTimeout), this.showTimeout = 0);
                        var i = this;
                        this.showTimeout = setTimeout(function() {
                            i.itemActivate(e);
                        }, this.opts.showOnClick && 1 == e.closest("ul").dataSM("level") ? 1 : this.opts.showTimeout);
                    }
                    this.$root.triggerHandler("mouseenter.smapi", e[0]);
                }
            },
            itemFocus: function(t) {
                var e = $(t.currentTarget);
                this.handleItemEvents(e) && (!this.focusActivated || this.isTouchMode() && e.dataSM("mousedown") || this.activatedItems.length && this.activatedItems[this.activatedItems.length - 1][0] == e[0] || this.itemActivate(e, !0), 
                this.$root.triggerHandler("focus.smapi", e[0]));
            },
            itemLeave: function(t) {
                var e = $(t.currentTarget);
                this.handleItemEvents(e) && (this.isTouchMode() || (e[0].blur(), this.showTimeout && (clearTimeout(this.showTimeout), 
                this.showTimeout = 0)), e.removeDataSM("mousedown"), this.$root.triggerHandler("mouseleave.smapi", e[0]));
            },
            menuHide: function(t) {
                if (!1 !== this.$root.triggerHandler("beforehide.smapi", t[0]) && (canAnimate && t.stop(!0, !0), 
                "none" != t.css("display"))) {
                    function e() {
                        t.css("z-index", "");
                    }
                    this.isCollapsible() ? canAnimate && this.opts.collapsibleHideFunction ? this.opts.collapsibleHideFunction.call(this, t, e) : t.hide(this.opts.collapsibleHideDuration, e) : canAnimate && this.opts.hideFunction ? this.opts.hideFunction.call(this, t, e) : t.hide(this.opts.hideDuration, e), 
                    t.dataSM("scroll") && (this.menuScrollStop(t), t.css({
                        "touch-action": "",
                        "-ms-touch-action": "",
                        "-webkit-transform": "",
                        transform: ""
                    }).off(".smartmenus_scroll").removeDataSM("scroll").dataSM("scroll-arrows").hide()), 
                    t.dataSM("parent-a").removeClass("highlighted").attr("aria-expanded", "false"), 
                    t.attr({
                        "aria-expanded": "false",
                        "aria-hidden": "true"
                    });
                    var i = t.dataSM("level");
                    this.activatedItems.splice(i - 1, 1), this.visibleSubMenus.splice($.inArray(t, this.visibleSubMenus), 1), 
                    this.$root.triggerHandler("hide.smapi", t[0]);
                }
            },
            menuHideAll: function() {
                this.showTimeout && (clearTimeout(this.showTimeout), this.showTimeout = 0);
                for (var t = this.opts.isPopup ? 1 : 0, e = this.visibleSubMenus.length - 1; t <= e; e--) this.menuHide(this.visibleSubMenus[e]);
                this.opts.isPopup && (canAnimate && this.$root.stop(!0, !0), this.$root.is(":visible") && (canAnimate && this.opts.hideFunction ? this.opts.hideFunction.call(this, this.$root) : this.$root.hide(this.opts.hideDuration))), 
                this.activatedItems = [], this.visibleSubMenus = [], this.clickActivated = !1, this.focusActivated = !1, 
                this.zIndexInc = 0, this.$root.triggerHandler("hideAll.smapi");
            },
            menuHideSubMenus: function(t) {
                for (var e = this.activatedItems.length - 1; t <= e; e--) {
                    var i = this.activatedItems[e].dataSM("sub");
                    i && this.menuHide(i);
                }
            },
            menuInit: function(t) {
                if (!t.dataSM("in-mega")) {
                    t.hasClass("mega-menu") && t.find("ul").dataSM("in-mega", !0);
                    for (var e = 2, i = t[0]; (i = i.parentNode.parentNode) != this.$root[0]; ) e++;
                    var s = t.prevAll("a").eq(-1);
                    s.length || (s = t.prevAll().find("a").eq(-1)), s.addClass("has-submenu").dataSM("sub", t), 
                    t.dataSM("parent-a", s).dataSM("level", e).parent().dataSM("sub", t);
                    var o = s.attr("id") || this.accessIdPrefix + ++this.idInc, a = t.attr("id") || this.accessIdPrefix + ++this.idInc;
                    s.attr({
                        id: o,
                        "aria-haspopup": "true",
                        "aria-controls": a,
                        "aria-expanded": "false"
                    }), t.attr({
                        id: a,
                        role: "group",
                        "aria-hidden": "true",
                        "aria-labelledby": o,
                        "aria-expanded": "false"
                    }), this.opts.subIndicators && s[this.opts.subIndicatorsPos](this.$subArrow.clone());
                }
            },
            menuPosition: function(t) {
                var e, i, s = t.dataSM("parent-a"), o = s.closest("li"), a = o.parent(), n = t.dataSM("level"), r = this.getWidth(t), h = this.getHeight(t), u = s.offset(), l = u.left, c = u.top, d = this.getWidth(s), m = this.getHeight(s), p = $(window), f = p.scrollLeft(), v = p.scrollTop(), b = this.getViewportWidth(), S = this.getViewportHeight(), g = a.parent().is("[data-sm-horizontal-sub]") || 2 == n && !a.hasClass("sm-vertical"), M = this.opts.rightToLeftSubMenus && !o.is("[data-sm-reverse]") || !this.opts.rightToLeftSubMenus && o.is("[data-sm-reverse]"), w = 2 == n ? this.opts.mainMenuSubOffsetX : this.opts.subMenusSubOffsetX, T = 2 == n ? this.opts.mainMenuSubOffsetY : this.opts.subMenusSubOffsetY;
                if (i = g ? (e = M ? d - r - w : w, this.opts.bottomToTopSubMenus ? -h - T : m + T) : (e = M ? w - r : d - w, 
                this.opts.bottomToTopSubMenus ? m - T - h : T), this.opts.keepInViewport) {
                    var y = l + e, I = c + i;
                    if (M && y < f ? e = g ? f - y + e : d - w : !M && f + b < y + r && (e = g ? f + b - r - y + e : w - r), 
                    g || (h < S && v + S < I + h ? i += v + S - h - I : (S <= h || I < v) && (i += v - I)), 
                    g && (v + S + .49 < I + h || I < v) || !g && S + .49 < h) {
                        var x = this;
                        t.dataSM("scroll-arrows") || t.dataSM("scroll-arrows", $([ $('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0], $('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0] ]).on({
                            mouseenter: function() {
                                t.dataSM("scroll").up = $(this).hasClass("scroll-up"), x.menuScroll(t);
                            },
                            mouseleave: function(e) {
                                x.menuScrollStop(t), x.menuScrollOut(t, e);
                            },
                            "mousewheel DOMMouseScroll": function(t) {
                                t.preventDefault();
                            }
                        }).insertAfter(t));
                        var A = ".smartmenus_scroll";
                        if (t.dataSM("scroll", {
                            y: this.cssTransforms3d ? 0 : i - m,
                            step: 1,
                            itemH: m,
                            subH: h,
                            arrowDownH: this.getHeight(t.dataSM("scroll-arrows").eq(1))
                        }).on(getEventsNS({
                            mouseover: function(e) {
                                x.menuScrollOver(t, e);
                            },
                            mouseout: function(e) {
                                x.menuScrollOut(t, e);
                            },
                            "mousewheel DOMMouseScroll": function(e) {
                                x.menuScrollMousewheel(t, e);
                            }
                        }, A)).dataSM("scroll-arrows").css({
                            top: "auto",
                            left: "0",
                            marginLeft: e + (parseInt(t.css("border-left-width")) || 0),
                            width: r - (parseInt(t.css("border-left-width")) || 0) - (parseInt(t.css("border-right-width")) || 0),
                            zIndex: t.css("z-index")
                        }).eq(g && this.opts.bottomToTopSubMenus ? 0 : 1).show(), this.isFixed()) {
                            var C = {};
                            C[touchEvents ? "touchstart touchmove touchend" : "pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"] = function(e) {
                                x.menuScrollTouch(t, e);
                            }, t.css({
                                "touch-action": "none",
                                "-ms-touch-action": "none"
                            }).on(getEventsNS(C, A));
                        }
                    }
                }
                t.css({
                    top: "auto",
                    left: "0",
                    marginLeft: e,
                    marginTop: i - m
                });
            },
            menuScroll: function(t, e, i) {
                var s, o = t.dataSM("scroll"), a = t.dataSM("scroll-arrows"), n = o.up ? o.upEnd : o.downEnd;
                if (!e && o.momentum) {
                    if (o.momentum *= .92, (s = o.momentum) < .5) return void this.menuScrollStop(t);
                } else s = i || (e || !this.opts.scrollAccelerate ? this.opts.scrollStep : Math.floor(o.step));
                var r = t.dataSM("level");
                if (this.activatedItems[r - 1] && this.activatedItems[r - 1].dataSM("sub") && this.activatedItems[r - 1].dataSM("sub").is(":visible") && this.menuHideSubMenus(r - 1), 
                o.y = o.up && o.y >= n || !o.up && n >= o.y ? o.y : Math.abs(n - o.y) > s ? o.y + (o.up ? s : -s) : n, 
                t.css(this.cssTransforms3d ? {
                    "-webkit-transform": "translate3d(0, " + o.y + "px, 0)",
                    transform: "translate3d(0, " + o.y + "px, 0)"
                } : {
                    marginTop: o.y
                }), mouse && (o.up && o.y > o.downEnd || !o.up && o.y < o.upEnd) && a.eq(o.up ? 1 : 0).show(), 
                o.y == n) mouse && a.eq(o.up ? 0 : 1).hide(), this.menuScrollStop(t); else if (!e) {
                    this.opts.scrollAccelerate && o.step < this.opts.scrollStep && (o.step += .2);
                    var h = this;
                    this.scrollTimeout = requestAnimationFrame(function() {
                        h.menuScroll(t);
                    });
                }
            },
            menuScrollMousewheel: function(t, e) {
                if (this.getClosestMenu(e.target) == t[0]) {
                    var i = 0 < ((e = e.originalEvent).wheelDelta || -e.detail);
                    t.dataSM("scroll-arrows").eq(i ? 0 : 1).is(":visible") && (t.dataSM("scroll").up = i, 
                    this.menuScroll(t, !0));
                }
                e.preventDefault();
            },
            menuScrollOut: function(t, e) {
                mouse && (/^scroll-(up|down)/.test((e.relatedTarget || "").className) || (t[0] == e.relatedTarget || $.contains(t[0], e.relatedTarget)) && this.getClosestMenu(e.relatedTarget) == t[0] || t.dataSM("scroll-arrows").css("visibility", "hidden"));
            },
            menuScrollOver: function(t, e) {
                if (mouse && !/^scroll-(up|down)/.test(e.target.className) && this.getClosestMenu(e.target) == t[0]) {
                    this.menuScrollRefreshData(t);
                    var i = t.dataSM("scroll"), s = $(window).scrollTop() - t.dataSM("parent-a").offset().top - i.itemH;
                    t.dataSM("scroll-arrows").eq(0).css("margin-top", s).end().eq(1).css("margin-top", s + this.getViewportHeight() - i.arrowDownH).end().css("visibility", "visible");
                }
            },
            menuScrollRefreshData: function(t) {
                var e = t.dataSM("scroll"), i = $(window).scrollTop() - t.dataSM("parent-a").offset().top - e.itemH;
                this.cssTransforms3d && (i = -(parseFloat(t.css("margin-top")) - i)), $.extend(e, {
                    upEnd: i,
                    downEnd: i + this.getViewportHeight() - e.subH
                });
            },
            menuScrollStop: function(t) {
                return this.scrollTimeout ? (cancelAnimationFrame(this.scrollTimeout), this.scrollTimeout = 0, 
                t.dataSM("scroll").step = 1, !0) : void 0;
            },
            menuScrollTouch: function(t, e) {
                if (isTouchEvent(e = e.originalEvent)) {
                    var i = this.getTouchPoint(e);
                    if (this.getClosestMenu(i.target) == t[0]) {
                        var s = t.dataSM("scroll");
                        if (/(start|down)$/i.test(e.type)) this.menuScrollStop(t) ? (e.preventDefault(), 
                        this.$touchScrollingSub = t) : this.$touchScrollingSub = null, this.menuScrollRefreshData(t), 
                        $.extend(s, {
                            touchStartY: i.pageY,
                            touchStartTime: e.timeStamp
                        }); else if (/move$/i.test(e.type)) {
                            var o = void 0 !== s.touchY ? s.touchY : s.touchStartY;
                            if (void 0 !== o && o != i.pageY) {
                                this.$touchScrollingSub = t;
                                var a = i.pageY > o;
                                void 0 !== s.up && s.up != a && $.extend(s, {
                                    touchStartY: i.pageY,
                                    touchStartTime: e.timeStamp
                                }), $.extend(s, {
                                    up: a,
                                    touchY: i.pageY
                                }), this.menuScroll(t, !0, Math.abs(i.pageY - o));
                            }
                            e.preventDefault();
                        } else void 0 !== s.touchY && ((s.momentum = 15 * Math.pow(Math.abs(i.pageY - s.touchStartY) / (e.timeStamp - s.touchStartTime), 2)) && (this.menuScrollStop(t), 
                        this.menuScroll(t), e.preventDefault()), delete s.touchY);
                    }
                }
            },
            menuShow: function(t) {
                if ((t.dataSM("beforefirstshowfired") || (t.dataSM("beforefirstshowfired", !0), 
                !1 !== this.$root.triggerHandler("beforefirstshow.smapi", t[0]))) && !1 !== this.$root.triggerHandler("beforeshow.smapi", t[0]) && (t.dataSM("shown-before", !0), 
                canAnimate && t.stop(!0, !0), !t.is(":visible"))) {
                    var e = t.dataSM("parent-a"), i = this.isCollapsible();
                    if ((this.opts.keepHighlighted || i) && e.addClass("highlighted"), i) t.removeClass("sm-nowrap").css({
                        zIndex: "",
                        width: "auto",
                        minWidth: "",
                        maxWidth: "",
                        top: "",
                        left: "",
                        marginLeft: "",
                        marginTop: ""
                    }); else {
                        if (t.css("z-index", this.zIndexInc = (this.zIndexInc || this.getStartZIndex()) + 1), 
                        (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) && (t.css({
                            width: "auto",
                            minWidth: "",
                            maxWidth: ""
                        }).addClass("sm-nowrap"), this.opts.subMenusMinWidth && t.css("min-width", this.opts.subMenusMinWidth), 
                        this.opts.subMenusMaxWidth)) {
                            var s = this.getWidth(t);
                            t.css("max-width", this.opts.subMenusMaxWidth), s > this.getWidth(t) && t.removeClass("sm-nowrap").css("width", this.opts.subMenusMaxWidth);
                        }
                        this.menuPosition(t);
                    }
                    function o() {
                        t.css("overflow", "");
                    }
                    i ? canAnimate && this.opts.collapsibleShowFunction ? this.opts.collapsibleShowFunction.call(this, t, o) : t.show(this.opts.collapsibleShowDuration, o) : canAnimate && this.opts.showFunction ? this.opts.showFunction.call(this, t, o) : t.show(this.opts.showDuration, o), 
                    e.attr("aria-expanded", "true"), t.attr({
                        "aria-expanded": "true",
                        "aria-hidden": "false"
                    }), this.visibleSubMenus.push(t), this.$root.triggerHandler("show.smapi", t[0]);
                }
            },
            popupHide: function(t) {
                this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = 0);
                var e = this;
                this.hideTimeout = setTimeout(function() {
                    e.menuHideAll();
                }, t ? 1 : this.opts.hideTimeout);
            },
            popupShow: function(t, e) {
                if (this.opts.isPopup) {
                    if (this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = 0), 
                    this.$root.dataSM("shown-before", !0), canAnimate && this.$root.stop(!0, !0), !this.$root.is(":visible")) {
                        this.$root.css({
                            left: t,
                            top: e
                        });
                        function s() {
                            i.$root.css("overflow", "");
                        }
                        var i = this;
                        canAnimate && this.opts.showFunction ? this.opts.showFunction.call(this, this.$root, s) : this.$root.show(this.opts.showDuration, s), 
                        this.visibleSubMenus[0] = this.$root;
                    }
                } else alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.');
            },
            refresh: function() {
                this.destroy(!0), this.init(!0);
            },
            rootKeyDown: function(t) {
                if (this.handleEvents()) switch (t.keyCode) {
                  case 27:
                    var e = this.activatedItems[0];
                    if (e) this.menuHideAll(), e[0].focus(), (i = e.dataSM("sub")) && this.menuHide(i);
                    break;

                  case 32:
                    var i, s = $(t.target);
                    if (s.is("a") && this.handleItemEvents(s)) (i = s.dataSM("sub")) && !i.is(":visible") && (this.itemClick({
                        currentTarget: t.target
                    }), t.preventDefault());
                }
            },
            rootOut: function(t) {
                if (this.handleEvents() && !this.isTouchMode() && t.target != this.$root[0] && (this.hideTimeout && (clearTimeout(this.hideTimeout), 
                this.hideTimeout = 0), !this.opts.showOnClick || !this.opts.hideOnClick)) {
                    var e = this;
                    this.hideTimeout = setTimeout(function() {
                        e.menuHideAll();
                    }, this.opts.hideTimeout);
                }
            },
            rootOver: function(t) {
                this.handleEvents() && !this.isTouchMode() && t.target != this.$root[0] && this.hideTimeout && (clearTimeout(this.hideTimeout), 
                this.hideTimeout = 0);
            },
            winResize: function(t) {
                if (this.handleEvents()) {
                    if (!("onorientationchange" in window) || "orientationchange" == t.type) {
                        var e = this.isCollapsible();
                        this.wasCollapsible && e || (this.activatedItems.length && this.activatedItems[this.activatedItems.length - 1][0].blur(), 
                        this.menuHideAll()), this.wasCollapsible = e;
                    }
                } else if (this.$disableOverlay) {
                    var i = this.$root.offset();
                    this.$disableOverlay.css({
                        top: i.top,
                        left: i.left,
                        width: this.$root.outerWidth(),
                        height: this.$root.outerHeight()
                    });
                }
            }
        }
    }), $.fn.dataSM = function(t, e) {
        return e ? this.data(t + "_smartmenus", e) : this.data(t + "_smartmenus");
    }, $.fn.removeDataSM = function(t) {
        return this.removeData(t + "_smartmenus");
    }, $.fn.smartmenus = function(options) {
        if ("string" != typeof options) return this.each(function() {
            var dataOpts = $(this).data("sm-options") || null;
            if (dataOpts) try {
                dataOpts = eval("(" + dataOpts + ")");
            } catch (e) {
                dataOpts = null, alert('ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.');
            }
            new $.SmartMenus(this, $.extend({}, $.fn.smartmenus.defaults, options, dataOpts));
        });
        var args = arguments, method = options;
        return Array.prototype.shift.call(args), this.each(function() {
            var t = $(this).data("smartmenus");
            t && t[method] && t[method].apply(t, args);
        });
    }, $.fn.smartmenus.defaults = {
        isPopup: !1,
        mainMenuSubOffsetX: 0,
        mainMenuSubOffsetY: 0,
        subMenusSubOffsetX: 0,
        subMenusSubOffsetY: 0,
        subMenusMinWidth: "10em",
        subMenusMaxWidth: "20em",
        subIndicators: !0,
        subIndicatorsPos: "append",
        subIndicatorsText: "",
        scrollStep: 30,
        scrollAccelerate: !0,
        showTimeout: 250,
        hideTimeout: 500,
        showDuration: 0,
        showFunction: null,
        hideDuration: 0,
        hideFunction: function(t, e) {
            t.fadeOut(200, e);
        },
        collapsibleShowDuration: 0,
        collapsibleShowFunction: function(t, e) {
            t.slideDown(200, e);
        },
        collapsibleHideDuration: 0,
        collapsibleHideFunction: function(t, e) {
            t.slideUp(200, e);
        },
        showOnClick: !1,
        hideOnClick: !0,
        noMouseOver: !1,
        keepInViewport: !0,
        keepHighlighted: !0,
        markCurrentItem: !1,
        markCurrentTree: !0,
        rightToLeftSubMenus: !1,
        bottomToTopSubMenus: !1,
        collapsibleBehavior: "default"
    }, $;
}), function($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: !1,
            menuActiveClass: "nav-active",
            menuOpener: ".nav-opener",
            menuDrop: ".nav-drop",
            toggleEvent: "click",
            outsideClickEvent: "click touchstart pointerdown MSPointerDown"
        }, options), this.initStructure(), this.attachEvents();
    }
    MobileNav.prototype = {
        initStructure: function() {
            this.page = $("html"), this.container = $(this.options.container), this.opener = this.container.find(this.options.menuOpener), 
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function() {
            var self = this;
            activateResizeHandler && (activateResizeHandler(), activateResizeHandler = null), 
            this.outsideClickHandler = function(e) {
                if (self.isOpened()) {
                    var target = $(e.target);
                    target.closest(self.opener).length || target.closest(self.drop).length || self.hide();
                }
            }, this.openerClickHandler = function(e) {
                e.preventDefault(), self.toggle();
            }, this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function() {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function() {
            this.container.addClass(this.options.menuActiveClass), this.options.hideOnClickOutside && this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
        },
        hide: function() {
            this.container.removeClass(this.options.menuActiveClass), this.options.hideOnClickOutside && this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        },
        toggle: function() {
            this.isOpened() ? this.hide() : this.show();
        },
        destroy: function() {
            this.container.removeClass(this.options.menuActiveClass), this.opener.off(this.options.toggleEvent, this.clickHandler), 
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };
    var activateResizeHandler = function() {
        function removeClassHandler() {
            flag = !1, doc.removeClass("resize-active");
        }
        var flag, timer, win = $(window), doc = $("html");
        win.on("resize orientationchange", function() {
            flag || (flag = !0, doc.addClass("resize-active")), clearTimeout(timer), timer = setTimeout(removeClassHandler, 500);
        });
    };
    $.fn.mobileNav = function(opt) {
        var args = Array.prototype.slice.call(arguments), method = args[0];
        return this.each(function() {
            var $container = jQuery(this), instance = $container.data("MobileNav");
            "object" == typeof opt || void 0 === opt ? $container.data("MobileNav", new MobileNav($.extend({
                container: this
            }, opt))) : "string" == typeof method && instance && "function" == typeof instance[method] && (args.shift(), 
            instance[method].apply(instance, args));
        });
    };
}(jQuery), function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.AOS = t();
}(this, function() {
    "use strict";
    function b() {
        return l.Date.now();
    }
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, t = "Expected a function", n = NaN, o = "[object Symbol]", i = /^\s+|\s+$/g, a = /^[-+]0x[0-9a-f]+$/i, r = /^0b[01]+$/i, c = /^0o[0-7]+$/i, s = parseInt, u = "object" == typeof e && e && e.Object === Object && e, d = "object" == typeof self && self && self.Object === Object && self, l = u || d || Function("return this")(), f = Object.prototype.toString, m = Math.max, p = Math.min;
    function g(e) {
        var t = typeof e;
        return !!e && ("object" == t || "function" == t);
    }
    function w(e) {
        if ("number" == typeof e) return e;
        if (function(e) {
            return "symbol" == typeof e || function(e) {
                return !!e && "object" == typeof e;
            }(e) && f.call(e) == o;
        }(e)) return n;
        if (g(e)) {
            var t = "function" == typeof e.valueOf ? e.valueOf() : e;
            e = g(t) ? t + "" : t;
        }
        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(i, "");
        var u = r.test(e);
        return u || c.test(e) ? s(e.slice(2), u ? 2 : 8) : a.test(e) ? n : +e;
    }
    function y(e, n, o) {
        var i = !0, a = !0;
        if ("function" != typeof e) throw new TypeError(t);
        return g(o) && (i = "leading" in o ? !!o.leading : i, a = "trailing" in o ? !!o.trailing : a), 
        function(e, n, o) {
            var i, a, r, c, s, u, d = 0, l = !1, f = !1, v = !0;
            if ("function" != typeof e) throw new TypeError(t);
            function y(t) {
                var n = i, o = a;
                return i = a = void 0, d = t, c = e.apply(o, n);
            }
            function h(e) {
                var t = e - u;
                return void 0 === u || n <= t || t < 0 || f && r <= e - d;
            }
            function k() {
                var e = b();
                if (h(e)) return x(e);
                s = setTimeout(k, function(e) {
                    var t = n - (e - u);
                    return f ? p(t, r - (e - d)) : t;
                }(e));
            }
            function x(e) {
                return s = void 0, v && i ? y(e) : (i = a = void 0, c);
            }
            function O() {
                var e = b(), t = h(e);
                if (i = arguments, a = this, u = e, t) {
                    if (void 0 === s) return function(e) {
                        return d = e, s = setTimeout(k, n), l ? y(e) : c;
                    }(u);
                    if (f) return s = setTimeout(k, n), y(u);
                }
                return void 0 === s && (s = setTimeout(k, n)), c;
            }
            return n = w(n) || 0, g(o) && (l = !!o.leading, r = (f = "maxWait" in o) ? m(w(o.maxWait) || 0, n) : r, 
            v = "trailing" in o ? !!o.trailing : v), O.cancel = function() {
                void 0 !== s && clearTimeout(s), i = u = a = s = void (d = 0);
            }, O.flush = function() {
                return void 0 === s ? c : x(b());
            }, O;
        }(e, n, {
            leading: i,
            maxWait: n,
            trailing: a
        });
    }
    function S() {
        return q.Date.now();
    }
    var O = /^\s+|\s+$/g, j = /^[-+]0x[0-9a-f]+$/i, E = /^0b[01]+$/i, N = /^0o[0-7]+$/i, z = parseInt, C = "object" == typeof e && e && e.Object === Object && e, A = "object" == typeof self && self && self.Object === Object && self, q = C || A || Function("return this")(), L = Object.prototype.toString, T = Math.max, M = Math.min;
    function D(e) {
        var t = typeof e;
        return !!e && ("object" == t || "function" == t);
    }
    function H(e) {
        if ("number" == typeof e) return e;
        if (function(e) {
            return "symbol" == typeof e || function(e) {
                return !!e && "object" == typeof e;
            }(e) && "[object Symbol]" == L.call(e);
        }(e)) return NaN;
        if (D(e)) {
            var t = "function" == typeof e.valueOf ? e.valueOf() : e;
            e = D(t) ? t + "" : t;
        }
        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(O, "");
        var n = E.test(e);
        return n || N.test(e) ? z(e.slice(2), n ? 2 : 8) : j.test(e) ? NaN : +e;
    }
    function $(e, t, n) {
        var o, i, a, r, c, s, u = 0, d = !1, l = !1, f = !0;
        if ("function" != typeof e) throw new TypeError("Expected a function");
        function m(t) {
            var n = o, a = i;
            return o = i = void 0, u = t, r = e.apply(a, n);
        }
        function p(e) {
            var n = e - s;
            return void 0 === s || t <= n || n < 0 || l && a <= e - u;
        }
        function b() {
            var e = S();
            if (p(e)) return v(e);
            c = setTimeout(b, function(e) {
                var n = t - (e - s);
                return l ? M(n, a - (e - u)) : n;
            }(e));
        }
        function v(e) {
            return c = void 0, f && o ? m(e) : (o = i = void 0, r);
        }
        function g() {
            var e = S(), n = p(e);
            if (o = arguments, i = this, s = e, n) {
                if (void 0 === c) return function(e) {
                    return u = e, c = setTimeout(b, t), d ? m(e) : r;
                }(s);
                if (l) return c = setTimeout(b, t), m(s);
            }
            return void 0 === c && (c = setTimeout(b, t)), r;
        }
        return t = H(t) || 0, D(n) && (d = !!n.leading, a = (l = "maxWait" in n) ? T(H(n.maxWait) || 0, t) : a, 
        f = "trailing" in n ? !!n.trailing : f), g.cancel = function() {
            void 0 !== c && clearTimeout(c), o = s = i = c = void (u = 0);
        }, g.flush = function() {
            return void 0 === c ? r : v(S());
        }, g;
    }
    var W = function() {};
    function P(e) {
        e && e.forEach(function(e) {
            var t = Array.prototype.slice.call(e.addedNodes), n = Array.prototype.slice.call(e.removedNodes);
            if (function e(t) {
                var n = void 0, o = void 0;
                for (n = 0; n < t.length; n += 1) {
                    if ((o = t[n]).dataset && o.dataset.aos) return !0;
                    if (o.children && e(o.children)) return !0;
                }
                return !1;
            }(t.concat(n))) return W();
        });
    }
    function Y() {
        return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    }
    var __isSupported = function() {
        return !!Y();
    }, __ready = function(e, t) {
        var n = window.document, o = new (Y())(P);
        W = t, o.observe(n.documentElement, {
            childList: !0,
            subtree: !0,
            removedNodes: !0
        });
    }, F = function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
                Object.defineProperty(e, o.key, o);
            }
        }
        return function(t, n, o) {
            return n && e(t.prototype, n), o && e(t, o), t;
        };
    }(), I = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
        }
        return e;
    }, K = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i, G = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i, J = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i, Q = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
    function R() {
        return navigator.userAgent || navigator.vendor || window.opera || "";
    }
    function V(e, t) {
        var n = void 0;
        return U.ie11() ? (n = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, {
            detail: t
        }) : n = new CustomEvent(e, {
            detail: t
        }), document.dispatchEvent(n);
    }
    function X(e) {
        return e.forEach(function(e, t) {
            return function(e, t) {
                var n = e.options, o = e.position, i = e.node, a = (e.data, function() {
                    e.animated && (function(e, t) {
                        t && t.forEach(function(t) {
                            return e.classList.remove(t);
                        });
                    }(i, n.animatedClassNames), V("aos:out", i), e.options.id && V("aos:in:" + e.options.id, i), 
                    e.animated = !1);
                });
                n.mirror && t >= o.out && !n.once ? a() : t >= o.in ? e.animated || (function(e, t) {
                    t && t.forEach(function(t) {
                        return e.classList.add(t);
                    });
                }(i, n.animatedClassNames), V("aos:in", i), e.options.id && V("aos:in:" + e.options.id, i), 
                e.animated = !0) : e.animated && !n.once && a();
            }(e, window.pageYOffset);
        });
    }
    function Z(e) {
        for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop); ) t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0), 
        n += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0), e = e.offsetParent;
        return {
            top: n,
            left: t
        };
    }
    function ee(e, t, n) {
        var o = e.getAttribute("data-aos-" + t);
        if (void 0 !== o) {
            if ("true" === o) return !0;
            if ("false" === o) return !1;
        }
        return o || n;
    }
    function ne() {
        var e = document.querySelectorAll("[data-aos]");
        return Array.prototype.map.call(e, function(e) {
            return {
                node: e
            };
        });
    }
    function re() {
        return document.all && !window.atob;
    }
    function ce() {
        0 < arguments.length && void 0 !== arguments[0] && arguments[0] && (ie = !0), ie && (oe = function(e, t) {
            return e.forEach(function(e, n) {
                var o = ee(e.node, "mirror", t.mirror), i = ee(e.node, "once", t.once), a = ee(e.node, "id"), r = t.useClassNames && e.node.getAttribute("data-aos"), c = [ t.animatedClassName ].concat(r ? r.split(" ") : []).filter(function(e) {
                    return "string" == typeof e;
                });
                t.initClassName && e.node.classList.add(t.initClassName), e.position = {
                    in: function(e, t, n) {
                        var o = window.innerHeight, i = ee(e, "anchor"), a = ee(e, "anchor-placement"), r = Number(ee(e, "offset", a ? 0 : t)), c = a || n, s = e;
                        i && document.querySelectorAll(i) && (s = document.querySelectorAll(i)[0]);
                        var u = Z(s).top - o;
                        switch (c) {
                          case "top-bottom":
                            break;

                          case "center-bottom":
                            u += s.offsetHeight / 2;
                            break;

                          case "bottom-bottom":
                            u += s.offsetHeight;
                            break;

                          case "top-center":
                            u += o / 2;
                            break;

                          case "center-center":
                            u += o / 2 + s.offsetHeight / 2;
                            break;

                          case "bottom-center":
                            u += o / 2 + s.offsetHeight;
                            break;

                          case "top-top":
                            u += o;
                            break;

                          case "bottom-top":
                            u += o + s.offsetHeight;
                            break;

                          case "center-top":
                            u += o + s.offsetHeight / 2;
                        }
                        return u + r;
                    }(e.node, t.offset, t.anchorPlacement),
                    out: o && function(e, t) {
                        window.innerHeight;
                        var n = ee(e, "anchor"), o = ee(e, "offset", t), i = e;
                        return n && document.querySelectorAll(n) && (i = document.querySelectorAll(n)[0]), 
                        Z(i).top + i.offsetHeight - o;
                    }(e.node, t.offset)
                }, e.options = {
                    once: i,
                    mirror: o,
                    animatedClassNames: c,
                    id: a
                };
            }), e;
        }(oe, ae), X(oe), window.addEventListener("scroll", y(function() {
            X(oe, ae.once);
        }, ae.throttleDelay)));
    }
    function se() {
        if (oe = ne(), de(ae.disable) || re()) return ue();
        ce();
    }
    var U = new (function() {
        function e() {
            !function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e);
        }
        return F(e, [ {
            key: "phone",
            value: function() {
                var e = R();
                return !(!K.test(e) && !G.test(e.substr(0, 4)));
            }
        }, {
            key: "mobile",
            value: function() {
                var e = R();
                return !(!J.test(e) && !Q.test(e.substr(0, 4)));
            }
        }, {
            key: "tablet",
            value: function() {
                return this.mobile() && !this.phone();
            }
        }, {
            key: "ie11",
            value: function() {
                return "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style;
            }
        } ]), e;
    }())(), oe = [], ie = !1, ae = {
        offset: 120,
        delay: 0,
        easing: "ease",
        duration: 400,
        disable: !1,
        once: !1,
        mirror: !1,
        anchorPlacement: "top-bottom",
        startEvent: "DOMContentLoaded",
        animatedClassName: "aos-animate",
        initClassName: "aos-init",
        useClassNames: !1,
        disableMutationObserver: !1,
        throttleDelay: 99,
        debounceDelay: 50
    }, ue = function() {
        oe.forEach(function(e, t) {
            e.node.removeAttribute("data-aos"), e.node.removeAttribute("data-aos-easing"), e.node.removeAttribute("data-aos-duration"), 
            e.node.removeAttribute("data-aos-delay"), ae.initClassName && e.node.classList.remove(ae.initClassName), 
            ae.animatedClassName && e.node.classList.remove(ae.animatedClassName);
        });
    }, de = function(e) {
        return !0 === e || "mobile" === e && U.mobile() || "phone" === e && U.phone() || "tablet" === e && U.tablet() || "function" == typeof e && !0 === e();
    };
    return {
        init: function(e) {
            return ae = I(ae, e), oe = ne(), ae.disableMutationObserver || __isSupported() || (console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '), 
            ae.disableMutationObserver = !0), ae.disableMutationObserver || __ready("[data-aos]", se), 
            de(ae.disable) || re() ? ue() : (document.querySelector("body").setAttribute("data-aos-easing", ae.easing), 
            document.querySelector("body").setAttribute("data-aos-duration", ae.duration), document.querySelector("body").setAttribute("data-aos-delay", ae.delay), 
            -1 === [ "DOMContentLoaded", "load" ].indexOf(ae.startEvent) ? document.addEventListener(ae.startEvent, function() {
                ce(!0);
            }) : window.addEventListener("load", function() {
                ce(!0);
            }), "DOMContentLoaded" === ae.startEvent && -1 < [ "complete", "interactive" ].indexOf(document.readyState) && ce(!0), 
            window.addEventListener("resize", $(ce, ae.debounceDelay, !0)), window.addEventListener("orientationchange", $(ce, ae.debounceDelay, !0)), 
            oe);
        },
        refresh: ce,
        refreshHard: se
    };
});