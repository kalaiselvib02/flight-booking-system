
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/svelte-awesome/components/svg/Path.svelte generated by Svelte v3.55.1 */

    const file$l = "node_modules/svelte-awesome/components/svg/Path.svelte";

    function create_fragment$p(ctx) {
    	let path;
    	let path_levels = [/*data*/ ctx[0]];
    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0]]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Path', slots, []);
    	let { data = {} } = $$props;
    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Path> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Path extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Path",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get data() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Polygon.svelte generated by Svelte v3.55.1 */

    const file$k = "node_modules/svelte-awesome/components/svg/Polygon.svelte";

    function create_fragment$o(ctx) {
    	let polygon;
    	let polygon_levels = [/*data*/ ctx[0]];
    	let polygon_data = {};

    	for (let i = 0; i < polygon_levels.length; i += 1) {
    		polygon_data = assign(polygon_data, polygon_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			set_svg_attributes(polygon, polygon_data);
    			add_location(polygon, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(polygon, polygon_data = get_spread_update(polygon_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0]]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Polygon', slots, []);
    	let { data = {} } = $$props;
    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Polygon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Polygon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Polygon",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get data() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Raw.svelte generated by Svelte v3.55.1 */

    const file$j = "node_modules/svelte-awesome/components/svg/Raw.svelte";

    function create_fragment$n(ctx) {
    	let g;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			add_location(g, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			g.innerHTML = /*raw*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1) g.innerHTML = /*raw*/ ctx[0];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Raw', slots, []);
    	let cursor = 0xd4937;

    	function getId() {
    		cursor += 1;
    		return `fa-${cursor.toString(16)}`;
    	}

    	let raw;
    	let { data } = $$props;

    	function getRaw(data) {
    		if (!data || !data.raw) {
    			return null;
    		}

    		let rawData = data.raw;
    		const ids = {};

    		rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
    			const uniqueId = getId();
    			ids[id] = uniqueId;
    			return ` id="${uniqueId}"`;
    		});

    		rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
    			const id = rawId || pointerId;

    			if (!id || !ids[id]) {
    				return match;
    			}

    			return `#${ids[id]}`;
    		});

    		return rawData;
    	}

    	$$self.$$.on_mount.push(function () {
    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console.warn("<Raw> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Raw> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ cursor, getId, raw, data, getRaw });

    	$$self.$inject_state = $$props => {
    		if ('cursor' in $$props) cursor = $$props.cursor;
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			$$invalidate(0, raw = getRaw(data));
    		}
    	};

    	return [raw, data];
    }

    class Raw extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Raw",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get data() {
    		throw new Error("<Raw>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Raw>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Svg.svelte generated by Svelte v3.55.1 */

    const file$i = "node_modules/svelte-awesome/components/svg/Svg.svelte";

    function create_fragment$m(ctx) {
    	let svg;
    	let svg_class_value;
    	let svg_role_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "class", svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an");
    			attr_dev(svg, "x", /*x*/ ctx[8]);
    			attr_dev(svg, "y", /*y*/ ctx[9]);
    			attr_dev(svg, "width", /*width*/ ctx[1]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			attr_dev(svg, "role", svg_role_value = /*label*/ ctx[11] ? 'img' : 'presentation');
    			attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			attr_dev(svg, "style", /*style*/ ctx[10]);
    			toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === 'horizontal');
    			toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === 'vertical');
    			add_location(svg, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (!current || dirty & /*x*/ 256) {
    				attr_dev(svg, "x", /*x*/ ctx[8]);
    			}

    			if (!current || dirty & /*y*/ 512) {
    				attr_dev(svg, "y", /*y*/ ctx[9]);
    			}

    			if (!current || dirty & /*width*/ 2) {
    				attr_dev(svg, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty & /*label*/ 2048) {
    				attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			}

    			if (!current || dirty & /*label*/ 2048 && svg_role_value !== (svg_role_value = /*label*/ ctx[11] ? 'img' : 'presentation')) {
    				attr_dev(svg, "role", svg_role_value);
    			}

    			if (!current || dirty & /*box*/ 8) {
    				attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			}

    			if (!current || dirty & /*style*/ 1024) {
    				attr_dev(svg, "style", /*style*/ ctx[10]);
    			}

    			if (!current || dirty & /*className, spin*/ 17) {
    				toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			}

    			if (!current || dirty & /*className, pulse*/ 65) {
    				toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			}

    			if (!current || dirty & /*className, inverse*/ 33) {
    				toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			}

    			if (!current || dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === 'horizontal');
    			}

    			if (!current || dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === 'vertical');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['default']);
    	let { class: className } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { box } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { style = undefined } = $$props;
    	let { label = undefined } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (className === undefined && !('class' in $$props || $$self.$$.bound[$$self.$$.props['class']])) {
    			console.warn("<Svg> was created without expected prop 'class'");
    		}

    		if (width === undefined && !('width' in $$props || $$self.$$.bound[$$self.$$.props['width']])) {
    			console.warn("<Svg> was created without expected prop 'width'");
    		}

    		if (height === undefined && !('height' in $$props || $$self.$$.bound[$$self.$$.props['height']])) {
    			console.warn("<Svg> was created without expected prop 'height'");
    		}

    		if (box === undefined && !('box' in $$props || $$self.$$.bound[$$self.$$.props['box']])) {
    			console.warn("<Svg> was created without expected prop 'box'");
    		}
    	});

    	const writable_props = [
    		'class',
    		'width',
    		'height',
    		'box',
    		'spin',
    		'inverse',
    		'pulse',
    		'flip',
    		'x',
    		'y',
    		'style',
    		'label'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('box' in $$props) $$invalidate(3, box = $$props.box);
    		if ('spin' in $$props) $$invalidate(4, spin = $$props.spin);
    		if ('inverse' in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ('pulse' in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ('flip' in $$props) $$invalidate(7, flip = $$props.flip);
    		if ('x' in $$props) $$invalidate(8, x = $$props.x);
    		if ('y' in $$props) $$invalidate(9, y = $$props.y);
    		if ('style' in $$props) $$invalidate(10, style = $$props.style);
    		if ('label' in $$props) $$invalidate(11, label = $$props.label);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('box' in $$props) $$invalidate(3, box = $$props.box);
    		if ('spin' in $$props) $$invalidate(4, spin = $$props.spin);
    		if ('inverse' in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ('pulse' in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ('flip' in $$props) $$invalidate(7, flip = $$props.flip);
    		if ('x' in $$props) $$invalidate(8, x = $$props.x);
    		if ('y' in $$props) $$invalidate(9, y = $$props.y);
    		if ('style' in $$props) $$invalidate(10, style = $$props.style);
    		if ('label' in $$props) $$invalidate(11, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label,
    		$$scope,
    		slots
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			class: 0,
    			width: 1,
    			height: 2,
    			box: 3,
    			spin: 4,
    			inverse: 5,
    			pulse: 6,
    			flip: 7,
    			x: 8,
    			y: 9,
    			style: 10,
    			label: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get class() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get box() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set box(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/Icon.svelte generated by Svelte v3.55.1 */

    const { Object: Object_1, console: console_1$2 } = globals;

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    // (4:4) {#if self}
    function create_if_block$8(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*self*/ ctx[6].paths && create_if_block_3(ctx);
    	let if_block1 = /*self*/ ctx[6].polygons && create_if_block_2(ctx);
    	let if_block2 = /*self*/ ctx[6].raw && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[6].paths) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[6].polygons) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[6].raw) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 64) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$4(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(4:4) {#if self}",
    		ctx
    	});

    	return block;
    }

    // (5:6) {#if self.paths}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*self*/ ctx[6].paths;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 64) {
    				each_value_1 = /*self*/ ctx[6].paths;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(5:6) {#if self.paths}",
    		ctx
    	});

    	return block;
    }

    // (6:8) {#each self.paths as path}
    function create_each_block_1$3(ctx) {
    	let path;
    	let current;

    	path = new Path({
    			props: { data: /*path*/ ctx[32] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(path.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(path, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const path_changes = {};
    			if (dirty[0] & /*self*/ 64) path_changes.data = /*path*/ ctx[32];
    			path.$set(path_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(path.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(path.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(path, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(6:8) {#each self.paths as path}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#if self.polygons}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*self*/ ctx[6].polygons;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 64) {
    				each_value = /*self*/ ctx[6].polygons;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(10:6) {#if self.polygons}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each self.polygons as polygon}
    function create_each_block$4(ctx) {
    	let polygon;
    	let current;

    	polygon = new Polygon({
    			props: { data: /*polygon*/ ctx[29] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(polygon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polygon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const polygon_changes = {};
    			if (dirty[0] & /*self*/ 64) polygon_changes.data = /*polygon*/ ctx[29];
    			polygon.$set(polygon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polygon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polygon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polygon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(11:8) {#each self.polygons as polygon}",
    		ctx
    	});

    	return block;
    }

    // (15:6) {#if self.raw}
    function create_if_block_1$4(ctx) {
    	let raw;
    	let updating_data;
    	let current;

    	function raw_data_binding(value) {
    		/*raw_data_binding*/ ctx[15](value);
    	}

    	let raw_props = {};

    	if (/*self*/ ctx[6] !== void 0) {
    		raw_props.data = /*self*/ ctx[6];
    	}

    	raw = new Raw({ props: raw_props, $$inline: true });
    	binding_callbacks.push(() => bind(raw, 'data', raw_data_binding));

    	const block = {
    		c: function create() {
    			create_component(raw.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(raw, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const raw_changes = {};

    			if (!updating_data && dirty[0] & /*self*/ 64) {
    				updating_data = true;
    				raw_changes.data = /*self*/ ctx[6];
    				add_flush_callback(() => updating_data = false);
    			}

    			raw.$set(raw_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(raw.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(raw.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(raw, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(15:6) {#if self.raw}",
    		ctx
    	});

    	return block;
    }

    // (3:8)      
    function fallback_block$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*self*/ ctx[6] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(3:8)      ",
    		ctx
    	});

    	return block;
    }

    // (1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>
    function create_default_slot$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*self*/ 64)) {
    					default_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let svg;
    	let current;

    	svg = new Svg({
    			props: {
    				label: /*label*/ ctx[5],
    				width: /*width*/ ctx[7],
    				height: /*height*/ ctx[8],
    				box: /*box*/ ctx[10],
    				style: /*combinedStyle*/ ctx[9],
    				spin: /*spin*/ ctx[1],
    				flip: /*flip*/ ctx[4],
    				inverse: /*inverse*/ ctx[2],
    				pulse: /*pulse*/ ctx[3],
    				class: /*className*/ ctx[0],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};
    			if (dirty[0] & /*label*/ 32) svg_changes.label = /*label*/ ctx[5];
    			if (dirty[0] & /*width*/ 128) svg_changes.width = /*width*/ ctx[7];
    			if (dirty[0] & /*height*/ 256) svg_changes.height = /*height*/ ctx[8];
    			if (dirty[0] & /*box*/ 1024) svg_changes.box = /*box*/ ctx[10];
    			if (dirty[0] & /*combinedStyle*/ 512) svg_changes.style = /*combinedStyle*/ ctx[9];
    			if (dirty[0] & /*spin*/ 2) svg_changes.spin = /*spin*/ ctx[1];
    			if (dirty[0] & /*flip*/ 16) svg_changes.flip = /*flip*/ ctx[4];
    			if (dirty[0] & /*inverse*/ 4) svg_changes.inverse = /*inverse*/ ctx[2];
    			if (dirty[0] & /*pulse*/ 8) svg_changes.pulse = /*pulse*/ ctx[3];
    			if (dirty[0] & /*className*/ 1) svg_changes.class = /*className*/ ctx[0];

    			if (dirty[0] & /*$$scope, self*/ 65600) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function normaliseData(data) {
    	if ('iconName' in data && 'icon' in data) {
    		let normalisedData = {};
    		let faIcon = data.icon;
    		let name = data.iconName;
    		let width = faIcon[0];
    		let height = faIcon[1];
    		let paths = faIcon[4];
    		let iconData = { width, height, paths: [{ d: paths }] };
    		normalisedData[name] = iconData;
    		return normalisedData;
    	}

    	return data;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { data } = $$props;
    	let { scale = 1 } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { label = null } = $$props;
    	let self = null;
    	let { style = null } = $$props;

    	// internal
    	let x = 0;

    	let y = 0;
    	let childrenHeight = 0;
    	let childrenWidth = 0;
    	let outerScale = 1;
    	let width;
    	let height;
    	let combinedStyle;
    	let box;

    	function init() {
    		if (typeof data === 'undefined') {
    			return;
    		}

    		const normalisedData = normaliseData(data);
    		const [name] = Object.keys(normalisedData);
    		const icon = normalisedData[name];

    		if (!icon.paths) {
    			icon.paths = [];
    		}

    		if (icon.d) {
    			icon.paths.push({ d: icon.d });
    		}

    		if (!icon.polygons) {
    			icon.polygons = [];
    		}

    		if (icon.points) {
    			icon.polygons.push({ points: icon.points });
    		}

    		$$invalidate(6, self = icon);
    	}

    	function normalisedScale() {
    		let numScale = 1;

    		if (typeof scale !== 'undefined') {
    			numScale = Number(scale);
    		}

    		if (isNaN(numScale) || numScale <= 0) {
    			// eslint-disable-line no-restricted-globals
    			console.warn('Invalid prop: prop "scale" should be a number over 0.'); // eslint-disable-line no-console

    			return outerScale;
    		}

    		return numScale * outerScale;
    	}

    	function calculateBox() {
    		if (self) {
    			return `0 0 ${self.width} ${self.height}`;
    		}

    		return `0 0 ${width} ${height}`;
    	}

    	function calculateRatio() {
    		if (!self) {
    			return 1;
    		}

    		return Math.max(self.width, self.height) / 16;
    	}

    	function calculateWidth() {
    		if (childrenWidth) {
    			return childrenWidth;
    		}

    		if (self) {
    			return self.width / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateHeight() {
    		if (childrenHeight) {
    			return childrenHeight;
    		}

    		if (self) {
    			return self.height / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateStyle() {
    		let combined = "";

    		if (style !== null) {
    			combined += style;
    		}

    		let size = normalisedScale();

    		if (size === 1) {
    			if (combined.length === 0) {
    				return undefined;
    			}

    			return combined;
    		}

    		if (combined !== "" && !combined.endsWith(';')) {
    			combined += '; ';
    		}

    		return `${combined}font-size: ${size}em`;
    	}

    	$$self.$$.on_mount.push(function () {
    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console_1$2.warn("<Icon> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['class', 'data', 'scale', 'spin', 'inverse', 'pulse', 'flip', 'label', 'style'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	function raw_data_binding(value) {
    		self = value;
    		$$invalidate(6, self);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    		if ('data' in $$props) $$invalidate(11, data = $$props.data);
    		if ('scale' in $$props) $$invalidate(12, scale = $$props.scale);
    		if ('spin' in $$props) $$invalidate(1, spin = $$props.spin);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ('pulse' in $$props) $$invalidate(3, pulse = $$props.pulse);
    		if ('flip' in $$props) $$invalidate(4, flip = $$props.flip);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('style' in $$props) $$invalidate(13, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Path,
    		Polygon,
    		Raw,
    		Svg,
    		className,
    		data,
    		scale,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		self,
    		style,
    		x,
    		y,
    		childrenHeight,
    		childrenWidth,
    		outerScale,
    		width,
    		height,
    		combinedStyle,
    		box,
    		init,
    		normaliseData,
    		normalisedScale,
    		calculateBox,
    		calculateRatio,
    		calculateWidth,
    		calculateHeight,
    		calculateStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('data' in $$props) $$invalidate(11, data = $$props.data);
    		if ('scale' in $$props) $$invalidate(12, scale = $$props.scale);
    		if ('spin' in $$props) $$invalidate(1, spin = $$props.spin);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ('pulse' in $$props) $$invalidate(3, pulse = $$props.pulse);
    		if ('flip' in $$props) $$invalidate(4, flip = $$props.flip);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('self' in $$props) $$invalidate(6, self = $$props.self);
    		if ('style' in $$props) $$invalidate(13, style = $$props.style);
    		if ('x' in $$props) x = $$props.x;
    		if ('y' in $$props) y = $$props.y;
    		if ('childrenHeight' in $$props) childrenHeight = $$props.childrenHeight;
    		if ('childrenWidth' in $$props) childrenWidth = $$props.childrenWidth;
    		if ('outerScale' in $$props) outerScale = $$props.outerScale;
    		if ('width' in $$props) $$invalidate(7, width = $$props.width);
    		if ('height' in $$props) $$invalidate(8, height = $$props.height);
    		if ('combinedStyle' in $$props) $$invalidate(9, combinedStyle = $$props.combinedStyle);
    		if ('box' in $$props) $$invalidate(10, box = $$props.box);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, style, scale*/ 14336) {
    			{
    				init();
    				$$invalidate(7, width = calculateWidth());
    				$$invalidate(8, height = calculateHeight());
    				$$invalidate(9, combinedStyle = calculateStyle());
    				$$invalidate(10, box = calculateBox());
    			}
    		}
    	};

    	return [
    		className,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		self,
    		width,
    		height,
    		combinedStyle,
    		box,
    		data,
    		scale,
    		style,
    		slots,
    		raw_data_binding,
    		$$scope
    	];
    }

    class Icon$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				class: 0,
    				data: 11,
    				scale: 12,
    				spin: 1,
    				inverse: 2,
    				pulse: 3,
    				flip: 4,
    				label: 5,
    				style: 13
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const ticket = { ticket: { width: 1792, height: 1792, paths: [{ d: 'M1024 452l316 316-572 572-316-316zM813 1431l618-618q19-19 19-45t-19-45l-362-362q-18-18-45-18t-45 18l-618 618q-19 19-19 45t19 45l362 362q18 18 45 18t45-18zM1702 794l-907 908q-37 37-90.5 37t-90.5-37l-126-126q56-56 56-136t-56-136-136-56-136 56l-125-126q-37-37-37-90.5t37-90.5l907-906q37-37 90.5-37t90.5 37l125 125q-56 56-56 136t56 136 136 56 136-56l126 125q37 37 37 90.5t-37 90.5z' }] } };

    const APP_CONSTANTS = {
        SELECT_CITY: {
            FROM:"From",
            TO:"To",
            URL:"https://run.mocky.io/v3/8b1d2b79-0b1f-4f9f-bd56-17c5aad99ac5"
        },
        TABLE:{
            TABLE_HEAD_COLUMNS:[
                "Departure",
                "Duration",
                "Arrival",
                "Price",
                ""
            ]
        },
        FILTER_SECTION:{
            RETURN_DEPARTURE_OPTIONS:[
                {
                    name: "Before 11am",
                    value:"Before 11am"
                },
                {
                    name: "11am - 5pm",
                    value:"11am - 5pm"
                },
                {
                    name: "5pm - 9pm",
                    value:"5pm - 9pm"
                },
                {
                    name: "After 9pm",
                    value:"After 9pm"
                },
            ],
            AIRLINES_OPTIONS:[
               {
                name: "Indigo Airlines",
                value:"Indigo Airlines"
               },
               {
                name: "Spicejet",
                value:"Spicejet"
               },
               {
                name: "Air India",
                value:"Air India"
               },
               {
                name: "AirAsia India",
                value:"AirAsia India"
               },

            ]
        },
        OFFER_DATA:{
            TITLE:"One Time Offer !!",
            BODY:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        }
    };

    /* eslint-disable no-param-reassign */

    /**
     * Options for customizing ripples
     */
    const defaults = {
      color: 'currentColor',
      class: '',
      opacity: 0.1,
      centered: false,
      spreadingDuration: '.4s',
      spreadingDelay: '0s',
      spreadingTimingFunction: 'linear',
      clearingDuration: '1s',
      clearingDelay: '0s',
      clearingTimingFunction: 'ease-in-out',
    };

    /**
     * Creates a ripple element but does not destroy it (use RippleStop for that)
     *
     * @param {Event} e
     * @param {*} options
     * @returns Ripple element
     */
    function RippleStart(e, options = {}) {
      e.stopImmediatePropagation();
      const opts = { ...defaults, ...options };

      const isTouchEvent = e.touches ? !!e.touches[0] : false;
      // Parent element
      const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;

      // Create ripple
      const ripple = document.createElement('div');
      const rippleStyle = ripple.style;

      // Adding default stuff
      ripple.className = `material-ripple ${opts.class}`;
      rippleStyle.position = 'absolute';
      rippleStyle.color = 'inherit';
      rippleStyle.borderRadius = '50%';
      rippleStyle.pointerEvents = 'none';
      rippleStyle.width = '100px';
      rippleStyle.height = '100px';
      rippleStyle.marginTop = '-50px';
      rippleStyle.marginLeft = '-50px';
      target.appendChild(ripple);
      rippleStyle.opacity = opts.opacity;
      rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
      rippleStyle.transform = 'scale(0) translate(0,0)';
      rippleStyle.background = opts.color;

      // Positioning ripple
      const targetRect = target.getBoundingClientRect();
      if (opts.centered) {
        rippleStyle.top = `${targetRect.height / 2}px`;
        rippleStyle.left = `${targetRect.width / 2}px`;
      } else {
        const distY = isTouchEvent ? e.touches[0].clientY : e.clientY;
        const distX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        rippleStyle.top = `${distY - targetRect.top}px`;
        rippleStyle.left = `${distX - targetRect.left}px`;
      }

      // Enlarge ripple
      rippleStyle.transform = `scale(${
    Math.max(targetRect.width, targetRect.height) * 0.02
  }) translate(0,0)`;
      return ripple;
    }

    /**
     * Destroys the ripple, slowly fading it out.
     *
     * @param {Element} ripple
     */
    function RippleStop(ripple) {
      if (ripple) {
        ripple.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') ripple.remove();
        });
        ripple.style.opacity = 0;
      }
    }

    /**
     * @param node {Element}
     */
    var Ripple = (node, _options = {}) => {
      let options = _options;
      let destroyed = false;
      let ripple;
      let keyboardActive = false;
      const handleStart = (e) => {
        ripple = RippleStart(e, options);
      };
      const handleStop = () => RippleStop(ripple);
      const handleKeyboardStart = (e) => {
        if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
          ripple = RippleStart(e, { ...options, centered: true });
          keyboardActive = true;
        }
      };
      const handleKeyboardStop = () => {
        keyboardActive = false;
        handleStop();
      };

      function setup() {
        node.classList.add('s-ripple-container');
        node.addEventListener('pointerdown', handleStart);
        node.addEventListener('pointerup', handleStop);
        node.addEventListener('pointerleave', handleStop);
        node.addEventListener('keydown', handleKeyboardStart);
        node.addEventListener('keyup', handleKeyboardStop);
        destroyed = false;
      }

      function destroy() {
        node.classList.remove('s-ripple-container');
        node.removeEventListener('pointerdown', handleStart);
        node.removeEventListener('pointerup', handleStop);
        node.removeEventListener('pointerleave', handleStop);
        node.removeEventListener('keydown', handleKeyboardStart);
        node.removeEventListener('keyup', handleKeyboardStop);
        destroyed = true;
      }

      if (options) setup();

      return {
        update(newOptions) {
          options = newOptions;
          if (options && destroyed) setup();
          else if (!(options || destroyed)) destroy();
        },
        destroy,
      };
    };

    /**
     * Click Outside
     * @param {Node} node
     */
    var ClickOutside = (node, _options = {}) => {
      const options = { include: [], ..._options };

      function detect({ target }) {
        if (!node.contains(target) || options.include.some((i) => target.isSameNode(i))) {
          node.dispatchEvent(new CustomEvent('clickOutside'));
        }
      }
      document.addEventListener('click', detect, { passive: true, capture: true });
      return {
        destroy() {
          document.removeEventListener('click', detect);
        },
      };
    };

    /* node_modules/svelte-materialify/dist/components/MaterialApp/MaterialApp.svelte generated by Svelte v3.55.1 */

    const file$h = "node_modules/svelte-materialify/dist/components/MaterialApp/MaterialApp.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-app theme--" + /*theme*/ ctx[0]);
    			add_location(div, file$h, 12279, 0, 247830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*theme*/ 1 && div_class_value !== (div_class_value = "s-app theme--" + /*theme*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MaterialApp', slots, ['default']);
    	let { theme = 'light' } = $$props;
    	const writable_props = ['theme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MaterialApp> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ theme });

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, $$scope, slots];
    }

    class MaterialApp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { theme: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MaterialApp",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get theme() {
    		throw new Error("<MaterialApp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<MaterialApp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function format$1(input) {
      if (typeof input === 'number') return `${input}px`;
      return input;
    }

    /**
     * @param node {Element}
     * @param styles {Object}
     */
    var Style = (node, _styles) => {
      let styles = _styles;
      Object.entries(styles).forEach(([key, value]) => {
        if (value) node.style.setProperty(`--s-${key}`, format$1(value));
      });

      return {
        update(newStyles) {
          Object.entries(newStyles).forEach(([key, value]) => {
            if (value) {
              node.style.setProperty(`--s-${key}`, format$1(value));
              delete styles[key];
            }
          });

          Object.keys(styles).forEach((name) => node.style.removeProperty(`--s-${name}`));

          styles = newStyles;
        },
      };
    };

    /* node_modules/svelte-materialify/dist/components/Icon/Icon.svelte generated by Svelte v3.55.1 */
    const file$g = "node_modules/svelte-materialify/dist/components/Icon/Icon.svelte";

    // (73:2) {#if path}
    function create_if_block$7(ctx) {
    	let svg;
    	let path_1;
    	let svg_viewBox_value;
    	let if_block = /*label*/ ctx[10] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			if (if_block) if_block.c();
    			attr_dev(path_1, "d", /*path*/ ctx[9]);
    			add_location(path_1, file$g, 78, 6, 1726);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", /*height*/ ctx[1]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*viewWidth*/ ctx[4] + " " + /*viewHeight*/ ctx[5]);
    			add_location(svg, file$g, 73, 4, 1594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path_1);
    			if (if_block) if_block.m(path_1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*label*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(path_1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*path*/ 512) {
    				attr_dev(path_1, "d", /*path*/ ctx[9]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(svg, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*viewWidth, viewHeight*/ 48 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*viewWidth*/ ctx[4] + " " + /*viewHeight*/ ctx[5])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(73:2) {#if path}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {#if label}
    function create_if_block_1$3(ctx) {
    	let title;
    	let t;

    	const block = {
    		c: function create() {
    			title = svg_element("title");
    			t = text(/*label*/ ctx[10]);
    			add_location(title, file$g, 80, 10, 1774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title, anchor);
    			append_dev(title, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 1024) set_data_dev(t, /*label*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(80:8) {#if label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let i;
    	let t;
    	let i_class_value;
    	let Style_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*path*/ ctx[9] && create_if_block$7(ctx);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(i, "aria-hidden", "true");
    			attr_dev(i, "class", i_class_value = "s-icon " + /*klass*/ ctx[2]);
    			attr_dev(i, "aria-label", /*label*/ ctx[10]);
    			attr_dev(i, "aria-disabled", /*disabled*/ ctx[8]);
    			attr_dev(i, "style", /*style*/ ctx[11]);
    			toggle_class(i, "spin", /*spin*/ ctx[7]);
    			toggle_class(i, "disabled", /*disabled*/ ctx[8]);
    			add_location(i, file$g, 63, 0, 1362);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			if (if_block) if_block.m(i, null);
    			append_dev(i, t);

    			if (default_slot) {
    				default_slot.m(i, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(Style_action = Style.call(null, i, {
    					'icon-size': /*size*/ ctx[3],
    					'icon-rotate': `${/*rotate*/ ctx[6]}deg`
    				}));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*path*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(i, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 4 && i_class_value !== (i_class_value = "s-icon " + /*klass*/ ctx[2])) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (!current || dirty & /*label*/ 1024) {
    				attr_dev(i, "aria-label", /*label*/ ctx[10]);
    			}

    			if (!current || dirty & /*disabled*/ 256) {
    				attr_dev(i, "aria-disabled", /*disabled*/ ctx[8]);
    			}

    			if (!current || dirty & /*style*/ 2048) {
    				attr_dev(i, "style", /*style*/ ctx[11]);
    			}

    			if (Style_action && is_function(Style_action.update) && dirty & /*size, rotate*/ 72) Style_action.update.call(null, {
    				'icon-size': /*size*/ ctx[3],
    				'icon-rotate': `${/*rotate*/ ctx[6]}deg`
    			});

    			if (!current || dirty & /*klass, spin*/ 132) {
    				toggle_class(i, "spin", /*spin*/ ctx[7]);
    			}

    			if (!current || dirty & /*klass, disabled*/ 260) {
    				toggle_class(i, "disabled", /*disabled*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { size = '24px' } = $$props;
    	let { width = size } = $$props;
    	let { height = size } = $$props;
    	let { viewWidth = '24' } = $$props;
    	let { viewHeight = '24' } = $$props;
    	let { rotate = 0 } = $$props;
    	let { spin = false } = $$props;
    	let { disabled = false } = $$props;
    	let { path = null } = $$props;
    	let { label = null } = $$props;
    	let { style = null } = $$props;

    	const writable_props = [
    		'class',
    		'size',
    		'width',
    		'height',
    		'viewWidth',
    		'viewHeight',
    		'rotate',
    		'spin',
    		'disabled',
    		'path',
    		'label',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(2, klass = $$props.class);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('viewWidth' in $$props) $$invalidate(4, viewWidth = $$props.viewWidth);
    		if ('viewHeight' in $$props) $$invalidate(5, viewHeight = $$props.viewHeight);
    		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
    		if ('spin' in $$props) $$invalidate(7, spin = $$props.spin);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$props.disabled);
    		if ('path' in $$props) $$invalidate(9, path = $$props.path);
    		if ('label' in $$props) $$invalidate(10, label = $$props.label);
    		if ('style' in $$props) $$invalidate(11, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Style,
    		klass,
    		size,
    		width,
    		height,
    		viewWidth,
    		viewHeight,
    		rotate,
    		spin,
    		disabled,
    		path,
    		label,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(2, klass = $$props.klass);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('viewWidth' in $$props) $$invalidate(4, viewWidth = $$props.viewWidth);
    		if ('viewHeight' in $$props) $$invalidate(5, viewHeight = $$props.viewHeight);
    		if ('rotate' in $$props) $$invalidate(6, rotate = $$props.rotate);
    		if ('spin' in $$props) $$invalidate(7, spin = $$props.spin);
    		if ('disabled' in $$props) $$invalidate(8, disabled = $$props.disabled);
    		if ('path' in $$props) $$invalidate(9, path = $$props.path);
    		if ('label' in $$props) $$invalidate(10, label = $$props.label);
    		if ('style' in $$props) $$invalidate(11, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size*/ 8) {
    			{
    				$$invalidate(0, width = size);
    				$$invalidate(1, height = size);
    			}
    		}
    	};

    	return [
    		width,
    		height,
    		klass,
    		size,
    		viewWidth,
    		viewHeight,
    		rotate,
    		spin,
    		disabled,
    		path,
    		label,
    		style,
    		$$scope,
    		slots
    	];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 2,
    			size: 3,
    			width: 0,
    			height: 1,
    			viewWidth: 4,
    			viewHeight: 5,
    			rotate: 6,
    			spin: 7,
    			disabled: 8,
    			path: 9,
    			label: 10,
    			style: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewWidth() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewWidth(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewHeight() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewHeight(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotate() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotate(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const filter = (classes) => classes.filter((x) => !!x);
    const format = (classes) => classes.split(' ').filter((x) => !!x);

    /**
     * @param node {Element}
     * @param classes {Array<string>}
     */
    var Class = (node, _classes) => {
      let classes = _classes;
      node.classList.add(...format(filter(classes).join(' ')));
      return {
        update(_newClasses) {
          const newClasses = _newClasses;
          newClasses.forEach((klass, i) => {
            if (klass) node.classList.add(...format(klass));
            else if (classes[i]) node.classList.remove(...format(classes[i]));
          });
          classes = newClasses;
        },
      };
    };

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* node_modules/svelte-materialify/dist/components/ItemGroup/ItemGroup.svelte generated by Svelte v3.55.1 */
    const file$f = "node_modules/svelte-materialify/dist/components/ItemGroup/ItemGroup.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-item-group " + /*klass*/ ctx[0]);
    			attr_dev(div, "role", /*role*/ ctx[1]);
    			attr_dev(div, "style", /*style*/ ctx[2]);
    			add_location(div, file$f, 58, 0, 1536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-item-group " + /*klass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*role*/ 2) {
    				attr_dev(div, "role", /*role*/ ctx[1]);
    			}

    			if (!current || dirty & /*style*/ 4) {
    				attr_dev(div, "style", /*style*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ITEM_GROUP = {};

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemGroup', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { activeClass = '' } = $$props;
    	let { value = [] } = $$props;
    	let { multiple = false } = $$props;
    	let { mandatory = false } = $$props;
    	let { max = Infinity } = $$props;
    	let { role = null } = $$props;
    	let { style = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const valueStore = writable(value);
    	let startIndex = -1;

    	setContext(ITEM_GROUP, {
    		select: val => {
    			if (multiple) {
    				if (value.includes(val)) {
    					if (!mandatory || value.length > 1) {
    						value.splice(value.indexOf(val), 1);
    						$$invalidate(3, value);
    					}
    				} else if (value.length < max) $$invalidate(3, value = [...value, val]);
    			} else if (value === val) {
    				if (!mandatory) $$invalidate(3, value = null);
    			} else $$invalidate(3, value = val);
    		},
    		register: setValue => {
    			const u = valueStore.subscribe(val => {
    				setValue(multiple ? val : [val]);
    			});

    			onDestroy(u);
    		},
    		index: () => {
    			startIndex += 1;
    			return startIndex;
    		},
    		activeClass
    	});

    	const writable_props = [
    		'class',
    		'activeClass',
    		'value',
    		'multiple',
    		'mandatory',
    		'max',
    		'role',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('activeClass' in $$props) $$invalidate(4, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('multiple' in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ('mandatory' in $$props) $$invalidate(6, mandatory = $$props.mandatory);
    		if ('max' in $$props) $$invalidate(7, max = $$props.max);
    		if ('role' in $$props) $$invalidate(1, role = $$props.role);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ITEM_GROUP,
    		setContext,
    		createEventDispatcher,
    		onDestroy,
    		writable,
    		klass,
    		activeClass,
    		value,
    		multiple,
    		mandatory,
    		max,
    		role,
    		style,
    		dispatch,
    		valueStore,
    		startIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('activeClass' in $$props) $$invalidate(4, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('multiple' in $$props) $$invalidate(5, multiple = $$props.multiple);
    		if ('mandatory' in $$props) $$invalidate(6, mandatory = $$props.mandatory);
    		if ('max' in $$props) $$invalidate(7, max = $$props.max);
    		if ('role' in $$props) $$invalidate(1, role = $$props.role);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('startIndex' in $$props) startIndex = $$props.startIndex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 8) {
    			valueStore.set(value);
    		}

    		if ($$self.$$.dirty & /*value*/ 8) {
    			dispatch('change', value);
    		}
    	};

    	return [
    		klass,
    		role,
    		style,
    		value,
    		activeClass,
    		multiple,
    		mandatory,
    		max,
    		$$scope,
    		slots
    	];
    }

    class ItemGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 0,
    			activeClass: 4,
    			value: 3,
    			multiple: 5,
    			mandatory: 6,
    			max: 7,
    			role: 1,
    			style: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemGroup",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mandatory() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mandatory(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable no-param-reassign */

    /**
     * @param {string} klass
     */
    function formatClass(klass) {
      return klass.split(' ').map((i) => {
        if (/^(lighten|darken|accent)-/.test(i)) {
          return `text-${i}`;
        }
        return `${i}-text`;
      });
    }

    function setTextColor(node, text) {
      if (/^(#|rgb|hsl|currentColor)/.test(text)) {
        // This is a CSS hex.
        node.style.color = text;
        return false;
      }
      if (text.startsWith('--')) {
        // This is a CSS variable.
        node.style.color = `var(${text})`;
        return false;
      }
      const klass = formatClass(text);
      node.classList.add(...klass);
      return klass;
    }

    /**
     * @param node {Element}
     * @param text {string|boolean}
     */
    var TextColor = (node, text) => {
      let klass;
      if (typeof text === 'string') {
        klass = setTextColor(node, text);
      }

      return {
        update(newText) {
          if (klass) {
            node.classList.remove(...klass);
          } else {
            node.style.color = null;
          }

          if (typeof newText === 'string') {
            klass = setTextColor(node, newText);
          }
        },
      };
    };

    /* node_modules/svelte-materialify/dist/components/Input/Input.svelte generated by Svelte v3.55.1 */
    const file$e = "node_modules/svelte-materialify/dist/components/Input/Input.svelte";
    const get_append_outer_slot_changes$2 = dirty => ({});
    const get_append_outer_slot_context$2 = ctx => ({});
    const get_messages_slot_changes = dirty => ({});
    const get_messages_slot_context = ctx => ({});
    const get_prepend_outer_slot_changes$2 = dirty => ({});
    const get_prepend_outer_slot_context$2 = ctx => ({});

    function create_fragment$h(ctx) {
    	let div3;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div3_class_value;
    	let TextColor_action;
    	let current;
    	let mounted;
    	let dispose;
    	const prepend_outer_slot_template = /*#slots*/ ctx[9]["prepend-outer"];
    	const prepend_outer_slot = create_slot(prepend_outer_slot_template, ctx, /*$$scope*/ ctx[8], get_prepend_outer_slot_context$2);
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	const messages_slot_template = /*#slots*/ ctx[9].messages;
    	const messages_slot = create_slot(messages_slot_template, ctx, /*$$scope*/ ctx[8], get_messages_slot_context);
    	const append_outer_slot_template = /*#slots*/ ctx[9]["append-outer"];
    	const append_outer_slot = create_slot(append_outer_slot_template, ctx, /*$$scope*/ ctx[8], get_append_outer_slot_context$2);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (prepend_outer_slot) prepend_outer_slot.c();
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (messages_slot) messages_slot.c();
    			t2 = space();
    			if (append_outer_slot) append_outer_slot.c();
    			attr_dev(div0, "class", "s-input__slot");
    			add_location(div0, file$e, 386, 4, 9721);
    			attr_dev(div1, "class", "s-input__details");
    			add_location(div1, file$e, 389, 4, 9779);
    			attr_dev(div2, "class", "s-input__control");
    			add_location(div2, file$e, 385, 2, 9686);
    			attr_dev(div3, "class", div3_class_value = "s-input " + /*klass*/ ctx[0]);
    			attr_dev(div3, "style", /*style*/ ctx[7]);
    			toggle_class(div3, "dense", /*dense*/ ctx[2]);
    			toggle_class(div3, "error", /*error*/ ctx[5]);
    			toggle_class(div3, "success", /*success*/ ctx[6]);
    			toggle_class(div3, "readonly", /*readonly*/ ctx[3]);
    			toggle_class(div3, "disabled", /*disabled*/ ctx[4]);
    			add_location(div3, file$e, 375, 0, 9468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);

    			if (prepend_outer_slot) {
    				prepend_outer_slot.m(div3, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (messages_slot) {
    				messages_slot.m(div1, null);
    			}

    			append_dev(div3, t2);

    			if (append_outer_slot) {
    				append_outer_slot.m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(TextColor_action = TextColor.call(null, div3, /*success*/ ctx[6]
    				? 'success'
    				: /*error*/ ctx[5] ? 'error' : /*color*/ ctx[1]));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (prepend_outer_slot) {
    				if (prepend_outer_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						prepend_outer_slot,
    						prepend_outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(prepend_outer_slot_template, /*$$scope*/ ctx[8], dirty, get_prepend_outer_slot_changes$2),
    						get_prepend_outer_slot_context$2
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (messages_slot) {
    				if (messages_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						messages_slot,
    						messages_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(messages_slot_template, /*$$scope*/ ctx[8], dirty, get_messages_slot_changes),
    						get_messages_slot_context
    					);
    				}
    			}

    			if (append_outer_slot) {
    				if (append_outer_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						append_outer_slot,
    						append_outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(append_outer_slot_template, /*$$scope*/ ctx[8], dirty, get_append_outer_slot_changes$2),
    						get_append_outer_slot_context$2
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div3_class_value !== (div3_class_value = "s-input " + /*klass*/ ctx[0])) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty & /*style*/ 128) {
    				attr_dev(div3, "style", /*style*/ ctx[7]);
    			}

    			if (TextColor_action && is_function(TextColor_action.update) && dirty & /*success, error, color*/ 98) TextColor_action.update.call(null, /*success*/ ctx[6]
    			? 'success'
    			: /*error*/ ctx[5] ? 'error' : /*color*/ ctx[1]);

    			if (!current || dirty & /*klass, dense*/ 5) {
    				toggle_class(div3, "dense", /*dense*/ ctx[2]);
    			}

    			if (!current || dirty & /*klass, error*/ 33) {
    				toggle_class(div3, "error", /*error*/ ctx[5]);
    			}

    			if (!current || dirty & /*klass, success*/ 65) {
    				toggle_class(div3, "success", /*success*/ ctx[6]);
    			}

    			if (!current || dirty & /*klass, readonly*/ 9) {
    				toggle_class(div3, "readonly", /*readonly*/ ctx[3]);
    			}

    			if (!current || dirty & /*klass, disabled*/ 17) {
    				toggle_class(div3, "disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_outer_slot, local);
    			transition_in(default_slot, local);
    			transition_in(messages_slot, local);
    			transition_in(append_outer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_outer_slot, local);
    			transition_out(default_slot, local);
    			transition_out(messages_slot, local);
    			transition_out(append_outer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (prepend_outer_slot) prepend_outer_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (messages_slot) messages_slot.d(detaching);
    			if (append_outer_slot) append_outer_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, ['prepend-outer','default','messages','append-outer']);
    	let { class: klass = '' } = $$props;
    	let { color = null } = $$props;
    	let { dense = false } = $$props;
    	let { readonly = false } = $$props;
    	let { disabled = false } = $$props;
    	let { error = false } = $$props;
    	let { success = false } = $$props;
    	let { style = null } = $$props;
    	const writable_props = ['class', 'color', 'dense', 'readonly', 'disabled', 'error', 'success', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('dense' in $$props) $$invalidate(2, dense = $$props.dense);
    		if ('readonly' in $$props) $$invalidate(3, readonly = $$props.readonly);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('error' in $$props) $$invalidate(5, error = $$props.error);
    		if ('success' in $$props) $$invalidate(6, success = $$props.success);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TextColor,
    		klass,
    		color,
    		dense,
    		readonly,
    		disabled,
    		error,
    		success,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('dense' in $$props) $$invalidate(2, dense = $$props.dense);
    		if ('readonly' in $$props) $$invalidate(3, readonly = $$props.readonly);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('error' in $$props) $$invalidate(5, error = $$props.error);
    		if ('success' in $$props) $$invalidate(6, success = $$props.success);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [klass, color, dense, readonly, disabled, error, success, style, $$scope, slots];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 0,
    			color: 1,
    			dense: 2,
    			readonly: 3,
    			disabled: 4,
    			error: 5,
    			success: 6,
    			style: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get success() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set success(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable */
    // Shamefully ripped from https://github.com/lukeed/uid
    let IDX = 36;
    let HEX = '';
    while (IDX--) HEX += IDX.toString(36);

    var uid = (len) => {
      let str = '';
      let num = len || 11;
      while (num--) str += HEX[(Math.random() * 36) | 0];
      return str;
    };

    var closeIcon = 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z';

    /* node_modules/svelte-materialify/dist/components/TextField/TextField.svelte generated by Svelte v3.55.1 */
    const file$d = "node_modules/svelte-materialify/dist/components/TextField/TextField.svelte";
    const get_append_slot_changes$1 = dirty => ({});
    const get_append_slot_context$1 = ctx => ({});
    const get_clear_icon_slot_changes = dirty => ({});
    const get_clear_icon_slot_context = ctx => ({});
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});
    const get_prepend_slot_changes$1 = dirty => ({});
    const get_prepend_slot_context$1 = ctx => ({});
    const get_prepend_outer_slot_changes$1 = dirty => ({});
    const get_prepend_outer_slot_context$1 = ctx => ({ slot: "prepend-outer" });

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    const get_append_outer_slot_changes$1 = dirty => ({});
    const get_append_outer_slot_context$1 = ctx => ({ slot: "append-outer" });

    // (112:4) {#if clearable && value !== ''}
    function create_if_block_1$2(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const clear_icon_slot_template = /*#slots*/ ctx[33]["clear-icon"];
    	const clear_icon_slot = create_slot(clear_icon_slot_template, ctx, /*$$scope*/ ctx[43], get_clear_icon_slot_context);
    	const clear_icon_slot_or_fallback = clear_icon_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (clear_icon_slot_or_fallback) clear_icon_slot_or_fallback.c();
    			set_style(div, "cursor", "pointer");
    			add_location(div, file$d, 112, 6, 2674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (clear_icon_slot_or_fallback) {
    				clear_icon_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*clear*/ ctx[26], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (clear_icon_slot) {
    				if (clear_icon_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						clear_icon_slot,
    						clear_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(clear_icon_slot_template, /*$$scope*/ ctx[43], dirty, get_clear_icon_slot_changes),
    						get_clear_icon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clear_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clear_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (clear_icon_slot_or_fallback) clear_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(112:4) {#if clearable && value !== ''}",
    		ctx
    	});

    	return block;
    }

    // (115:32)             
    function fallback_block$2(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { path: closeIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(115:32)             ",
    		ctx
    	});

    	return block;
    }

    // (64:0) <Input    class="s-text-field {klass}"    {color}    {dense}    {readonly}    {disabled}    {error}    {success}    {style}>
    function create_default_slot$3(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let label;
    	let t1;
    	let t2;
    	let input;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	const prepend_slot_template = /*#slots*/ ctx[33].prepend;
    	const prepend_slot = create_slot(prepend_slot_template, ctx, /*$$scope*/ ctx[43], get_prepend_slot_context$1);
    	const default_slot_template = /*#slots*/ ctx[33].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[43], null);
    	const content_slot_template = /*#slots*/ ctx[33].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[43], get_content_slot_context);

    	let input_levels = [
    		{ type: "text" },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ id: /*id*/ ctx[20] },
    		{ readOnly: /*readonly*/ ctx[12] },
    		{ disabled: /*disabled*/ ctx[13] },
    		/*$$restProps*/ ctx[28]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block = /*clearable*/ ctx[11] && /*value*/ ctx[0] !== '' && create_if_block_1$2(ctx);
    	const append_slot_template = /*#slots*/ ctx[33].append;
    	const append_slot = create_slot(append_slot_template, ctx, /*$$scope*/ ctx[43], get_append_slot_context$1);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (prepend_slot) prepend_slot.c();
    			t0 = space();
    			div0 = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (content_slot) content_slot.c();
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			if (append_slot) append_slot.c();
    			attr_dev(label, "for", /*id*/ ctx[20]);
    			toggle_class(label, "active", /*labelActive*/ ctx[23]);
    			add_location(label, file$d, 85, 6, 2024);
    			set_attributes(input, input_data);
    			add_location(input, file$d, 90, 6, 2215);
    			attr_dev(div0, "class", "s-text-field__input");
    			add_location(div0, file$d, 84, 4, 1983);
    			attr_dev(div1, "class", "s-text-field__wrapper");
    			toggle_class(div1, "filled", /*filled*/ ctx[5]);
    			toggle_class(div1, "solo", /*solo*/ ctx[6]);
    			toggle_class(div1, "outlined", /*outlined*/ ctx[7]);
    			toggle_class(div1, "flat", /*flat*/ ctx[8]);
    			toggle_class(div1, "rounded", /*rounded*/ ctx[10]);
    			add_location(div1, file$d, 74, 2, 1768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (prepend_slot) {
    				prepend_slot.m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			append_dev(div0, t1);

    			if (content_slot) {
    				content_slot.m(div0, null);
    			}

    			append_dev(div0, t2);
    			append_dev(div0, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[41](input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div1, t3);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t4);

    			if (append_slot) {
    				append_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[42]),
    					listen_dev(input, "focus", /*onFocus*/ ctx[24], false, false, false),
    					listen_dev(input, "blur", /*onBlur*/ ctx[25], false, false, false),
    					listen_dev(input, "input", /*onInput*/ ctx[27], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[34], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[35], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[36], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[37], false, false, false),
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[38], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[39], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[40], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (prepend_slot) {
    				if (prepend_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						prepend_slot,
    						prepend_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(prepend_slot_template, /*$$scope*/ ctx[43], dirty, get_prepend_slot_changes$1),
    						get_prepend_slot_context$1
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[43], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 1048576) {
    				attr_dev(label, "for", /*id*/ ctx[20]);
    			}

    			if (!current || dirty[0] & /*labelActive*/ 8388608) {
    				toggle_class(label, "active", /*labelActive*/ ctx[23]);
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[43], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "text" },
    				(!current || dirty[0] & /*placeholder*/ 16384) && { placeholder: /*placeholder*/ ctx[14] },
    				(!current || dirty[0] & /*id*/ 1048576) && { id: /*id*/ ctx[20] },
    				(!current || dirty[0] & /*readonly*/ 4096) && { readOnly: /*readonly*/ ctx[12] },
    				(!current || dirty[0] & /*disabled*/ 8192) && { disabled: /*disabled*/ ctx[13] },
    				dirty[0] & /*$$restProps*/ 268435456 && /*$$restProps*/ ctx[28]
    			]));

    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (/*clearable*/ ctx[11] && /*value*/ ctx[0] !== '') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*clearable, value*/ 2049) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t4);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (append_slot) {
    				if (append_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						append_slot,
    						append_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(append_slot_template, /*$$scope*/ ctx[43], dirty, get_append_slot_changes$1),
    						get_append_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty[0] & /*filled*/ 32) {
    				toggle_class(div1, "filled", /*filled*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*solo*/ 64) {
    				toggle_class(div1, "solo", /*solo*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*outlined*/ 128) {
    				toggle_class(div1, "outlined", /*outlined*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*flat*/ 256) {
    				toggle_class(div1, "flat", /*flat*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*rounded*/ 1024) {
    				toggle_class(div1, "rounded", /*rounded*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_slot, local);
    			transition_in(default_slot, local);
    			transition_in(content_slot, local);
    			transition_in(if_block);
    			transition_in(append_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_slot, local);
    			transition_out(default_slot, local);
    			transition_out(content_slot, local);
    			transition_out(if_block);
    			transition_out(append_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (prepend_slot) prepend_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (content_slot) content_slot.d(detaching);
    			/*input_binding*/ ctx[41](null);
    			if (if_block) if_block.d();
    			if (append_slot) append_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(64:0) <Input    class=\\\"s-text-field {klass}\\\"    {color}    {dense}    {readonly}    {disabled}    {error}    {success}    {style}>",
    		ctx
    	});

    	return block;
    }

    // (74:2) 
    function create_prepend_outer_slot$1(ctx) {
    	let current;
    	const prepend_outer_slot_template = /*#slots*/ ctx[33]["prepend-outer"];
    	const prepend_outer_slot = create_slot(prepend_outer_slot_template, ctx, /*$$scope*/ ctx[43], get_prepend_outer_slot_context$1);

    	const block = {
    		c: function create() {
    			if (prepend_outer_slot) prepend_outer_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (prepend_outer_slot) {
    				prepend_outer_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prepend_outer_slot) {
    				if (prepend_outer_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						prepend_outer_slot,
    						prepend_outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(prepend_outer_slot_template, /*$$scope*/ ctx[43], dirty, get_prepend_outer_slot_changes$1),
    						get_prepend_outer_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_outer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_outer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prepend_outer_slot) prepend_outer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_prepend_outer_slot$1.name,
    		type: "slot",
    		source: "(74:2) ",
    		ctx
    	});

    	return block;
    }

    // (128:6) {#each messages as message}
    function create_each_block_1$2(ctx) {
    	let span;
    	let t_value = /*message*/ ctx[44] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$d, 127, 33, 3082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messages*/ 131072 && t_value !== (t_value = /*message*/ ctx[44] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(128:6) {#each messages as message}",
    		ctx
    	});

    	return block;
    }

    // (129:6) {#each errorMessages.slice(0, errorCount) as message}
    function create_each_block$3(ctx) {
    	let span;
    	let t_value = /*message*/ ctx[44] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$d, 128, 59, 3172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMessages, errorCount*/ 4456448 && t_value !== (t_value = /*message*/ ctx[44] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(129:6) {#each errorMessages.slice(0, errorCount) as message}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#if counter}
    function create_if_block$6(ctx) {
    	let span;
    	let t0_value = /*value*/ ctx[0].length + "";
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(" / ");
    			t2 = text(/*counter*/ ctx[16]);
    			add_location(span, file$d, 130, 17, 3232);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && t0_value !== (t0_value = /*value*/ ctx[0].length + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*counter*/ 65536) set_data_dev(t2, /*counter*/ ctx[16]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(131:4) {#if counter}",
    		ctx
    	});

    	return block;
    }

    // (125:2) 
    function create_messages_slot(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let each_value_1 = /*messages*/ ctx[17];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*errorMessages*/ ctx[22].slice(0, /*errorCount*/ ctx[18]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	let if_block = /*counter*/ ctx[16] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(/*hint*/ ctx[15]);
    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			if (if_block) if_block.c();
    			add_location(span, file$d, 126, 6, 3028);
    			add_location(div0, file$d, 125, 4, 3015);
    			attr_dev(div1, "slot", "messages");
    			add_location(div1, file$d, 124, 2, 2988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div0, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t3);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hint*/ 32768) set_data_dev(t0, /*hint*/ ctx[15]);

    			if (dirty[0] & /*messages*/ 131072) {
    				each_value_1 = /*messages*/ ctx[17];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*errorMessages, errorCount*/ 4456448) {
    				each_value = /*errorMessages*/ ctx[22].slice(0, /*errorCount*/ ctx[18]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*counter*/ ctx[16]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_messages_slot.name,
    		type: "slot",
    		source: "(125:2) ",
    		ctx
    	});

    	return block;
    }

    // (135:2) 
    function create_append_outer_slot$1(ctx) {
    	let current;
    	const append_outer_slot_template = /*#slots*/ ctx[33]["append-outer"];
    	const append_outer_slot = create_slot(append_outer_slot_template, ctx, /*$$scope*/ ctx[43], get_append_outer_slot_context$1);

    	const block = {
    		c: function create() {
    			if (append_outer_slot) append_outer_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (append_outer_slot) {
    				append_outer_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (append_outer_slot) {
    				if (append_outer_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						append_outer_slot,
    						append_outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(append_outer_slot_template, /*$$scope*/ ctx[43], dirty, get_append_outer_slot_changes$1),
    						get_append_outer_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(append_outer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(append_outer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (append_outer_slot) append_outer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_append_outer_slot$1.name,
    		type: "slot",
    		source: "(135:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				class: "s-text-field " + /*klass*/ ctx[3],
    				color: /*color*/ ctx[4],
    				dense: /*dense*/ ctx[9],
    				readonly: /*readonly*/ ctx[12],
    				disabled: /*disabled*/ ctx[13],
    				error: /*error*/ ctx[1],
    				success: /*success*/ ctx[19],
    				style: /*style*/ ctx[21],
    				$$slots: {
    					"append-outer": [create_append_outer_slot$1],
    					messages: [create_messages_slot],
    					"prepend-outer": [create_prepend_outer_slot$1],
    					default: [create_default_slot$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty[0] & /*klass*/ 8) input_changes.class = "s-text-field " + /*klass*/ ctx[3];
    			if (dirty[0] & /*color*/ 16) input_changes.color = /*color*/ ctx[4];
    			if (dirty[0] & /*dense*/ 512) input_changes.dense = /*dense*/ ctx[9];
    			if (dirty[0] & /*readonly*/ 4096) input_changes.readonly = /*readonly*/ ctx[12];
    			if (dirty[0] & /*disabled*/ 8192) input_changes.disabled = /*disabled*/ ctx[13];
    			if (dirty[0] & /*error*/ 2) input_changes.error = /*error*/ ctx[1];
    			if (dirty[0] & /*success*/ 524288) input_changes.success = /*success*/ ctx[19];
    			if (dirty[0] & /*style*/ 2097152) input_changes.style = /*style*/ ctx[21];

    			if (dirty[0] & /*counter, value, errorMessages, errorCount, messages, hint, filled, solo, outlined, flat, rounded, clearable, placeholder, id, readonly, disabled, $$restProps, inputElement, labelActive*/ 282590693 | dirty[1] & /*$$scope*/ 4096) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let labelActive;

    	const omit_props_names = [
    		"class","value","color","filled","solo","outlined","flat","dense","rounded","clearable","readonly","disabled","placeholder","hint","counter","messages","rules","errorCount","validateOnBlur","error","success","id","style","inputElement","validate"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;

    	validate_slots('TextField', slots, [
    		'append-outer','prepend-outer','prepend','default','content','clear-icon','append'
    	]);

    	let { class: klass = '' } = $$props;
    	let { value = '' } = $$props;
    	let { color = 'primary' } = $$props;
    	let { filled = false } = $$props;
    	let { solo = false } = $$props;
    	let { outlined = false } = $$props;
    	let { flat = false } = $$props;
    	let { dense = false } = $$props;
    	let { rounded = false } = $$props;
    	let { clearable = false } = $$props;
    	let { readonly = false } = $$props;
    	let { disabled = false } = $$props;
    	let { placeholder = null } = $$props;
    	let { hint = '' } = $$props;
    	let { counter = false } = $$props;
    	let { messages = [] } = $$props;
    	let { rules = [] } = $$props;
    	let { errorCount = 1 } = $$props;
    	let { validateOnBlur = false } = $$props;
    	let { error = false } = $$props;
    	let { success = false } = $$props;
    	let { id = `s-input-${uid(5)}` } = $$props;
    	let { style = null } = $$props;
    	let { inputElement = null } = $$props;
    	let focused = false;
    	let errorMessages = [];

    	function validate() {
    		$$invalidate(22, errorMessages = rules.map(r => r(value)).filter(r => typeof r === 'string'));

    		if (errorMessages.length) $$invalidate(1, error = true); else {
    			$$invalidate(1, error = false);
    		}

    		return error;
    	}

    	function onFocus() {
    		$$invalidate(32, focused = true);
    	}

    	function onBlur() {
    		$$invalidate(32, focused = false);
    		if (validateOnBlur) validate();
    	}

    	function clear() {
    		$$invalidate(0, value = '');
    	}

    	function onInput() {
    		if (!validateOnBlur) validate();
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(2, inputElement);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(28, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, klass = $$new_props.class);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('filled' in $$new_props) $$invalidate(5, filled = $$new_props.filled);
    		if ('solo' in $$new_props) $$invalidate(6, solo = $$new_props.solo);
    		if ('outlined' in $$new_props) $$invalidate(7, outlined = $$new_props.outlined);
    		if ('flat' in $$new_props) $$invalidate(8, flat = $$new_props.flat);
    		if ('dense' in $$new_props) $$invalidate(9, dense = $$new_props.dense);
    		if ('rounded' in $$new_props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('clearable' in $$new_props) $$invalidate(11, clearable = $$new_props.clearable);
    		if ('readonly' in $$new_props) $$invalidate(12, readonly = $$new_props.readonly);
    		if ('disabled' in $$new_props) $$invalidate(13, disabled = $$new_props.disabled);
    		if ('placeholder' in $$new_props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('hint' in $$new_props) $$invalidate(15, hint = $$new_props.hint);
    		if ('counter' in $$new_props) $$invalidate(16, counter = $$new_props.counter);
    		if ('messages' in $$new_props) $$invalidate(17, messages = $$new_props.messages);
    		if ('rules' in $$new_props) $$invalidate(29, rules = $$new_props.rules);
    		if ('errorCount' in $$new_props) $$invalidate(18, errorCount = $$new_props.errorCount);
    		if ('validateOnBlur' in $$new_props) $$invalidate(30, validateOnBlur = $$new_props.validateOnBlur);
    		if ('error' in $$new_props) $$invalidate(1, error = $$new_props.error);
    		if ('success' in $$new_props) $$invalidate(19, success = $$new_props.success);
    		if ('id' in $$new_props) $$invalidate(20, id = $$new_props.id);
    		if ('style' in $$new_props) $$invalidate(21, style = $$new_props.style);
    		if ('inputElement' in $$new_props) $$invalidate(2, inputElement = $$new_props.inputElement);
    		if ('$$scope' in $$new_props) $$invalidate(43, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Input,
    		Icon,
    		uid,
    		clearIcon: closeIcon,
    		klass,
    		value,
    		color,
    		filled,
    		solo,
    		outlined,
    		flat,
    		dense,
    		rounded,
    		clearable,
    		readonly,
    		disabled,
    		placeholder,
    		hint,
    		counter,
    		messages,
    		rules,
    		errorCount,
    		validateOnBlur,
    		error,
    		success,
    		id,
    		style,
    		inputElement,
    		focused,
    		errorMessages,
    		validate,
    		onFocus,
    		onBlur,
    		clear,
    		onInput,
    		labelActive
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('klass' in $$props) $$invalidate(3, klass = $$new_props.klass);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('filled' in $$props) $$invalidate(5, filled = $$new_props.filled);
    		if ('solo' in $$props) $$invalidate(6, solo = $$new_props.solo);
    		if ('outlined' in $$props) $$invalidate(7, outlined = $$new_props.outlined);
    		if ('flat' in $$props) $$invalidate(8, flat = $$new_props.flat);
    		if ('dense' in $$props) $$invalidate(9, dense = $$new_props.dense);
    		if ('rounded' in $$props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('clearable' in $$props) $$invalidate(11, clearable = $$new_props.clearable);
    		if ('readonly' in $$props) $$invalidate(12, readonly = $$new_props.readonly);
    		if ('disabled' in $$props) $$invalidate(13, disabled = $$new_props.disabled);
    		if ('placeholder' in $$props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('hint' in $$props) $$invalidate(15, hint = $$new_props.hint);
    		if ('counter' in $$props) $$invalidate(16, counter = $$new_props.counter);
    		if ('messages' in $$props) $$invalidate(17, messages = $$new_props.messages);
    		if ('rules' in $$props) $$invalidate(29, rules = $$new_props.rules);
    		if ('errorCount' in $$props) $$invalidate(18, errorCount = $$new_props.errorCount);
    		if ('validateOnBlur' in $$props) $$invalidate(30, validateOnBlur = $$new_props.validateOnBlur);
    		if ('error' in $$props) $$invalidate(1, error = $$new_props.error);
    		if ('success' in $$props) $$invalidate(19, success = $$new_props.success);
    		if ('id' in $$props) $$invalidate(20, id = $$new_props.id);
    		if ('style' in $$props) $$invalidate(21, style = $$new_props.style);
    		if ('inputElement' in $$props) $$invalidate(2, inputElement = $$new_props.inputElement);
    		if ('focused' in $$props) $$invalidate(32, focused = $$new_props.focused);
    		if ('errorMessages' in $$props) $$invalidate(22, errorMessages = $$new_props.errorMessages);
    		if ('labelActive' in $$props) $$invalidate(23, labelActive = $$new_props.labelActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*placeholder, value*/ 16385 | $$self.$$.dirty[1] & /*focused*/ 2) {
    			$$invalidate(23, labelActive = !!placeholder || value || focused);
    		}
    	};

    	return [
    		value,
    		error,
    		inputElement,
    		klass,
    		color,
    		filled,
    		solo,
    		outlined,
    		flat,
    		dense,
    		rounded,
    		clearable,
    		readonly,
    		disabled,
    		placeholder,
    		hint,
    		counter,
    		messages,
    		errorCount,
    		success,
    		id,
    		style,
    		errorMessages,
    		labelActive,
    		onFocus,
    		onBlur,
    		clear,
    		onInput,
    		$$restProps,
    		rules,
    		validateOnBlur,
    		validate,
    		focused,
    		slots,
    		focus_handler,
    		blur_handler,
    		input_handler,
    		change_handler,
    		keypress_handler,
    		keydown_handler,
    		keyup_handler,
    		input_binding,
    		input_input_handler,
    		$$scope
    	];
    }

    class TextField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				class: 3,
    				value: 0,
    				color: 4,
    				filled: 5,
    				solo: 6,
    				outlined: 7,
    				flat: 8,
    				dense: 9,
    				rounded: 10,
    				clearable: 11,
    				readonly: 12,
    				disabled: 13,
    				placeholder: 14,
    				hint: 15,
    				counter: 16,
    				messages: 17,
    				rules: 29,
    				errorCount: 18,
    				validateOnBlur: 30,
    				error: 1,
    				success: 19,
    				id: 20,
    				style: 21,
    				inputElement: 2,
    				validate: 31
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextField",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filled() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filled(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get solo() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set solo(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearable() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearable(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hint() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hint(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get counter() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set counter(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get messages() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messages(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rules() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rules(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorCount() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorCount(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validateOnBlur() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validateOnBlur(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get success() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set success(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<TextField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validate() {
    		return this.$$.ctx[31];
    	}

    	set validate(value) {
    		throw new Error("<TextField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/svelte-materialify/dist/components/Menu/Menu.svelte generated by Svelte v3.55.1 */
    const file$c = "node_modules/svelte-materialify/dist/components/Menu/Menu.svelte";
    const get_activator_slot_changes = dirty => ({});
    const get_activator_slot_context = ctx => ({});

    // (145:2) {#if active}
    function create_if_block$5(ctx) {
    	let div;
    	let div_class_value;
    	let div_style_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-menu " + /*klass*/ ctx[1]);
    			attr_dev(div, "role", "menu");
    			attr_dev(div, "style", div_style_value = "" + (/*position*/ ctx[9] + ";transform-origin:" + /*origin*/ ctx[8] + ";z-index:" + /*index*/ ctx[6] + ";" + /*style*/ ctx[7]));
    			toggle_class(div, "tile", /*tile*/ ctx[5]);
    			add_location(div, file$c, 145, 4, 3668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*menuClick*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*klass*/ 2 && div_class_value !== (div_class_value = "s-menu " + /*klass*/ ctx[1])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*position, origin, index, style*/ 960 && div_style_value !== (div_style_value = "" + (/*position*/ ctx[9] + ";transform-origin:" + /*origin*/ ctx[8] + ";z-index:" + /*index*/ ctx[6] + ";" + /*style*/ ctx[7]))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (!current || dirty[0] & /*klass, tile*/ 34) {
    				toggle_class(div, "tile", /*tile*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*transition*/ ctx[2], /*inOpts*/ ctx[3]);
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*transition*/ ctx[2], /*outOpts*/ ctx[4]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(145:2) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const activator_slot_template = /*#slots*/ ctx[26].activator;
    	const activator_slot = create_slot(activator_slot_template, ctx, /*$$scope*/ ctx[25], get_activator_slot_context);
    	let if_block = /*active*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (activator_slot) activator_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "s-menu__wrapper");
    			add_location(div, file$c, 136, 0, 3467);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (activator_slot) {
    				activator_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[27](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(ClickOutside.call(null, div)),
    					listen_dev(div, "clickOutside", /*clickOutsideMenu*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (activator_slot) {
    				if (activator_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						activator_slot,
    						activator_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(activator_slot_template, /*$$scope*/ ctx[25], dirty, get_activator_slot_changes),
    						get_activator_slot_context
    					);
    				}
    			}

    			if (/*active*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*active*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activator_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activator_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (activator_slot) activator_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, ['activator','default']);
    	let { class: klass = '' } = $$props;
    	let { active = false } = $$props;
    	let { absolute = false } = $$props;
    	let { transition = fade } = $$props;
    	let { inOpts = { duration: 250 } } = $$props;
    	let { outOpts = { duration: 200 } } = $$props;
    	let { offsetX = false } = $$props;
    	let { offsetY = true } = $$props;
    	let { nudgeX = 0 } = $$props;
    	let { nudgeY = 0 } = $$props;
    	let { openOnClick = true } = $$props;
    	let { hover = false } = $$props;
    	let { closeOnClickOutside = true } = $$props;
    	let { closeOnClick = true } = $$props;
    	let { bottom = false } = $$props;
    	let { right = false } = $$props;
    	let { tile = false } = $$props;
    	let { disabled = false } = $$props;
    	let { index = 8 } = $$props;
    	let { style = '' } = $$props;
    	let origin = 'top left';
    	let position;
    	let wrapper;
    	const dispatch = createEventDispatcher();

    	const align = {
    		x: right ? 'right' : 'left',
    		y: bottom ? 'bottom' : 'top'
    	};

    	setContext('S_ListItemRole', 'menuitem');
    	setContext('S_ListItemRipple', true);

    	// For opening the menu
    	function open(posX = 0, posY = 0) {
    		$$invalidate(0, active = true);
    		const rect = wrapper.getBoundingClientRect();
    		let x = nudgeX;
    		let y = nudgeY;

    		if (absolute) {
    			x += posX;
    			y += posY;
    		} else {
    			if (offsetX) x += rect.width;
    			if (offsetY) y += rect.height;
    		}

    		$$invalidate(9, position = `${align.y}:${y}px;${align.x}:${x}px`);
    		$$invalidate(8, origin = `${align.y} ${align.x}`);

    		/**
     * Event when menu is opened.
     * @returns Nothing
     */
    		dispatch('open');
    	}

    	// For closing the menu.
    	function close() {
    		$$invalidate(0, active = false);

    		/**
     * Event when menu is closed.
     * @returns Nothing
     */
    		dispatch('close');
    	}

    	// When the activator slot is clicked.
    	function triggerClick(e) {
    		if (!disabled) {
    			if (active) {
    				close();
    			} else if (openOnClick) {
    				open(e.offsetX, e.offsetY);
    			}
    		}
    	}

    	// When the menu itself is clicked.
    	function menuClick() {
    		if (active && closeOnClick) close();
    	}

    	// When user clicked somewhere outside the menu.
    	function clickOutsideMenu() {
    		if (active && closeOnClickOutside) close();
    	}

    	onMount(() => {
    		const trigger = wrapper.querySelector("[slot='activator']");

    		// Opening the menu if active is set to true.
    		if (active) open();

    		trigger.addEventListener('click', triggerClick, { passive: true });

    		if (hover) {
    			wrapper.addEventListener('mouseenter', open, { passive: true });
    			wrapper.addEventListener('mouseleave', close, { passive: true });
    		}

    		return () => {
    			trigger.removeEventListener('click', triggerClick);

    			if (hover) {
    				wrapper.removeEventListener('mouseenter', open);
    				wrapper.removeEventListener('mouseleave', close);
    			}
    		};
    	});

    	const writable_props = [
    		'class',
    		'active',
    		'absolute',
    		'transition',
    		'inOpts',
    		'outOpts',
    		'offsetX',
    		'offsetY',
    		'nudgeX',
    		'nudgeY',
    		'openOnClick',
    		'hover',
    		'closeOnClickOutside',
    		'closeOnClick',
    		'bottom',
    		'right',
    		'tile',
    		'disabled',
    		'index',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(10, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('absolute' in $$props) $$invalidate(13, absolute = $$props.absolute);
    		if ('transition' in $$props) $$invalidate(2, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(3, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(4, outOpts = $$props.outOpts);
    		if ('offsetX' in $$props) $$invalidate(14, offsetX = $$props.offsetX);
    		if ('offsetY' in $$props) $$invalidate(15, offsetY = $$props.offsetY);
    		if ('nudgeX' in $$props) $$invalidate(16, nudgeX = $$props.nudgeX);
    		if ('nudgeY' in $$props) $$invalidate(17, nudgeY = $$props.nudgeY);
    		if ('openOnClick' in $$props) $$invalidate(18, openOnClick = $$props.openOnClick);
    		if ('hover' in $$props) $$invalidate(19, hover = $$props.hover);
    		if ('closeOnClickOutside' in $$props) $$invalidate(20, closeOnClickOutside = $$props.closeOnClickOutside);
    		if ('closeOnClick' in $$props) $$invalidate(21, closeOnClick = $$props.closeOnClick);
    		if ('bottom' in $$props) $$invalidate(22, bottom = $$props.bottom);
    		if ('right' in $$props) $$invalidate(23, right = $$props.right);
    		if ('tile' in $$props) $$invalidate(5, tile = $$props.tile);
    		if ('disabled' in $$props) $$invalidate(24, disabled = $$props.disabled);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(25, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ClickOutside,
    		onMount,
    		setContext,
    		createEventDispatcher,
    		fade,
    		klass,
    		active,
    		absolute,
    		transition,
    		inOpts,
    		outOpts,
    		offsetX,
    		offsetY,
    		nudgeX,
    		nudgeY,
    		openOnClick,
    		hover,
    		closeOnClickOutside,
    		closeOnClick,
    		bottom,
    		right,
    		tile,
    		disabled,
    		index,
    		style,
    		origin,
    		position,
    		wrapper,
    		dispatch,
    		align,
    		open,
    		close,
    		triggerClick,
    		menuClick,
    		clickOutsideMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('absolute' in $$props) $$invalidate(13, absolute = $$props.absolute);
    		if ('transition' in $$props) $$invalidate(2, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(3, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(4, outOpts = $$props.outOpts);
    		if ('offsetX' in $$props) $$invalidate(14, offsetX = $$props.offsetX);
    		if ('offsetY' in $$props) $$invalidate(15, offsetY = $$props.offsetY);
    		if ('nudgeX' in $$props) $$invalidate(16, nudgeX = $$props.nudgeX);
    		if ('nudgeY' in $$props) $$invalidate(17, nudgeY = $$props.nudgeY);
    		if ('openOnClick' in $$props) $$invalidate(18, openOnClick = $$props.openOnClick);
    		if ('hover' in $$props) $$invalidate(19, hover = $$props.hover);
    		if ('closeOnClickOutside' in $$props) $$invalidate(20, closeOnClickOutside = $$props.closeOnClickOutside);
    		if ('closeOnClick' in $$props) $$invalidate(21, closeOnClick = $$props.closeOnClick);
    		if ('bottom' in $$props) $$invalidate(22, bottom = $$props.bottom);
    		if ('right' in $$props) $$invalidate(23, right = $$props.right);
    		if ('tile' in $$props) $$invalidate(5, tile = $$props.tile);
    		if ('disabled' in $$props) $$invalidate(24, disabled = $$props.disabled);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('style' in $$props) $$invalidate(7, style = $$props.style);
    		if ('origin' in $$props) $$invalidate(8, origin = $$props.origin);
    		if ('position' in $$props) $$invalidate(9, position = $$props.position);
    		if ('wrapper' in $$props) $$invalidate(10, wrapper = $$props.wrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		tile,
    		index,
    		style,
    		origin,
    		position,
    		wrapper,
    		menuClick,
    		clickOutsideMenu,
    		absolute,
    		offsetX,
    		offsetY,
    		nudgeX,
    		nudgeY,
    		openOnClick,
    		hover,
    		closeOnClickOutside,
    		closeOnClick,
    		bottom,
    		right,
    		disabled,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$f,
    			create_fragment$f,
    			safe_not_equal,
    			{
    				class: 1,
    				active: 0,
    				absolute: 13,
    				transition: 2,
    				inOpts: 3,
    				outOpts: 4,
    				offsetX: 14,
    				offsetY: 15,
    				nudgeX: 16,
    				nudgeY: 17,
    				openOnClick: 18,
    				hover: 19,
    				closeOnClickOutside: 20,
    				closeOnClick: 21,
    				bottom: 22,
    				right: 23,
    				tile: 5,
    				disabled: 24,
    				index: 6,
    				style: 7
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inOpts() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inOpts(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOpts() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOpts(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offsetX() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offsetX(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offsetY() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offsetY(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nudgeX() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nudgeX(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nudgeY() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nudgeY(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openOnClick() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set openOnClick(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnClickOutside() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnClickOutside(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnClick() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnClick(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-materialify/dist/components/List/ListItem.svelte generated by Svelte v3.55.1 */
    const file$b = "node_modules/svelte-materialify/dist/components/List/ListItem.svelte";
    const get_append_slot_changes = dirty => ({});
    const get_append_slot_context = ctx => ({});
    const get_subtitle_slot_changes = dirty => ({});
    const get_subtitle_slot_context = ctx => ({});
    const get_prepend_slot_changes = dirty => ({});
    const get_prepend_slot_context = ctx => ({});

    function create_fragment$e(ctx) {
    	let div3;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div3_class_value;
    	let div3_tabindex_value;
    	let div3_aria_selected_value;
    	let Class_action;
    	let Ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const prepend_slot_template = /*#slots*/ ctx[14].prepend;
    	const prepend_slot = create_slot(prepend_slot_template, ctx, /*$$scope*/ ctx[13], get_prepend_slot_context);
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	const subtitle_slot_template = /*#slots*/ ctx[14].subtitle;
    	const subtitle_slot = create_slot(subtitle_slot_template, ctx, /*$$scope*/ ctx[13], get_subtitle_slot_context);
    	const append_slot_template = /*#slots*/ ctx[14].append;
    	const append_slot = create_slot(append_slot_template, ctx, /*$$scope*/ ctx[13], get_append_slot_context);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (prepend_slot) prepend_slot.c();
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (subtitle_slot) subtitle_slot.c();
    			t2 = space();
    			if (append_slot) append_slot.c();
    			attr_dev(div0, "class", "s-list-item__title");
    			add_location(div0, file$b, 213, 4, 5437);
    			attr_dev(div1, "class", "s-list-item__subtitle");
    			add_location(div1, file$b, 216, 4, 5503);
    			attr_dev(div2, "class", "s-list-item__content");
    			add_location(div2, file$b, 212, 2, 5397);
    			attr_dev(div3, "class", div3_class_value = "s-list-item " + /*klass*/ ctx[1]);
    			attr_dev(div3, "role", /*role*/ ctx[10]);
    			attr_dev(div3, "tabindex", div3_tabindex_value = /*link*/ ctx[6] ? 0 : -1);
    			attr_dev(div3, "aria-selected", div3_aria_selected_value = /*role*/ ctx[10] === 'option' ? /*active*/ ctx[0] : null);
    			attr_dev(div3, "style", /*style*/ ctx[9]);
    			toggle_class(div3, "dense", /*dense*/ ctx[3]);
    			toggle_class(div3, "disabled", /*disabled*/ ctx[4]);
    			toggle_class(div3, "multiline", /*multiline*/ ctx[5]);
    			toggle_class(div3, "link", /*link*/ ctx[6]);
    			toggle_class(div3, "selectable", /*selectable*/ ctx[7]);
    			add_location(div3, file$b, 195, 0, 5033);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);

    			if (prepend_slot) {
    				prepend_slot.m(div3, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (subtitle_slot) {
    				subtitle_slot.m(div1, null);
    			}

    			append_dev(div3, t2);

    			if (append_slot) {
    				append_slot.m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Class_action = Class.call(null, div3, [/*active*/ ctx[0] && /*activeClass*/ ctx[2]])),
    					action_destroyer(Ripple_action = Ripple.call(null, div3, /*ripple*/ ctx[8])),
    					listen_dev(div3, "click", /*click*/ ctx[11], false, false, false),
    					listen_dev(div3, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(div3, "dblclick", /*dblclick_handler*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (prepend_slot) {
    				if (prepend_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						prepend_slot,
    						prepend_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(prepend_slot_template, /*$$scope*/ ctx[13], dirty, get_prepend_slot_changes),
    						get_prepend_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (subtitle_slot) {
    				if (subtitle_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						subtitle_slot,
    						subtitle_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(subtitle_slot_template, /*$$scope*/ ctx[13], dirty, get_subtitle_slot_changes),
    						get_subtitle_slot_context
    					);
    				}
    			}

    			if (append_slot) {
    				if (append_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						append_slot,
    						append_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(append_slot_template, /*$$scope*/ ctx[13], dirty, get_append_slot_changes),
    						get_append_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 2 && div3_class_value !== (div3_class_value = "s-list-item " + /*klass*/ ctx[1])) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty & /*link*/ 64 && div3_tabindex_value !== (div3_tabindex_value = /*link*/ ctx[6] ? 0 : -1)) {
    				attr_dev(div3, "tabindex", div3_tabindex_value);
    			}

    			if (!current || dirty & /*active*/ 1 && div3_aria_selected_value !== (div3_aria_selected_value = /*role*/ ctx[10] === 'option' ? /*active*/ ctx[0] : null)) {
    				attr_dev(div3, "aria-selected", div3_aria_selected_value);
    			}

    			if (!current || dirty & /*style*/ 512) {
    				attr_dev(div3, "style", /*style*/ ctx[9]);
    			}

    			if (Class_action && is_function(Class_action.update) && dirty & /*active, activeClass*/ 5) Class_action.update.call(null, [/*active*/ ctx[0] && /*activeClass*/ ctx[2]]);
    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 256) Ripple_action.update.call(null, /*ripple*/ ctx[8]);

    			if (!current || dirty & /*klass, dense*/ 10) {
    				toggle_class(div3, "dense", /*dense*/ ctx[3]);
    			}

    			if (!current || dirty & /*klass, disabled*/ 18) {
    				toggle_class(div3, "disabled", /*disabled*/ ctx[4]);
    			}

    			if (!current || dirty & /*klass, multiline*/ 34) {
    				toggle_class(div3, "multiline", /*multiline*/ ctx[5]);
    			}

    			if (!current || dirty & /*klass, link*/ 66) {
    				toggle_class(div3, "link", /*link*/ ctx[6]);
    			}

    			if (!current || dirty & /*klass, selectable*/ 130) {
    				toggle_class(div3, "selectable", /*selectable*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_slot, local);
    			transition_in(default_slot, local);
    			transition_in(subtitle_slot, local);
    			transition_in(append_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_slot, local);
    			transition_out(default_slot, local);
    			transition_out(subtitle_slot, local);
    			transition_out(append_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (prepend_slot) prepend_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (subtitle_slot) subtitle_slot.d(detaching);
    			if (append_slot) append_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItem', slots, ['prepend','default','subtitle','append']);
    	const role = getContext('S_ListItemRole');
    	const ITEM_GROUP = getContext('S_ListItemGroup');

    	const DEFAULTS = {
    		select: () => null,
    		register: () => null,
    		index: () => null,
    		activeClass: 'active'
    	};

    	const ITEM = ITEM_GROUP ? getContext(ITEM_GROUP) : DEFAULTS;
    	let { class: klass = '' } = $$props;
    	let { activeClass = ITEM.activeClass } = $$props;
    	let { value = ITEM.index() } = $$props;
    	let { active = false } = $$props;
    	let { dense = false } = $$props;
    	let { disabled = null } = $$props;
    	let { multiline = false } = $$props;
    	let { link = role } = $$props;
    	let { selectable = !link } = $$props;
    	let { ripple = getContext('S_ListItemRipple') || role || false } = $$props;
    	let { style = null } = $$props;

    	ITEM.register(values => {
    		$$invalidate(0, active = values.includes(value));
    	});

    	function click() {
    		if (!disabled) ITEM.select(value);
    	}

    	const writable_props = [
    		'class',
    		'activeClass',
    		'value',
    		'active',
    		'dense',
    		'disabled',
    		'multiline',
    		'link',
    		'selectable',
    		'ripple',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListItem> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dblclick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('activeClass' in $$props) $$invalidate(2, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(12, value = $$props.value);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('dense' in $$props) $$invalidate(3, dense = $$props.dense);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('multiline' in $$props) $$invalidate(5, multiline = $$props.multiline);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('selectable' in $$props) $$invalidate(7, selectable = $$props.selectable);
    		if ('ripple' in $$props) $$invalidate(8, ripple = $$props.ripple);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Ripple,
    		Class,
    		role,
    		ITEM_GROUP,
    		DEFAULTS,
    		ITEM,
    		klass,
    		activeClass,
    		value,
    		active,
    		dense,
    		disabled,
    		multiline,
    		link,
    		selectable,
    		ripple,
    		style,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('activeClass' in $$props) $$invalidate(2, activeClass = $$props.activeClass);
    		if ('value' in $$props) $$invalidate(12, value = $$props.value);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('dense' in $$props) $$invalidate(3, dense = $$props.dense);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('multiline' in $$props) $$invalidate(5, multiline = $$props.multiline);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('selectable' in $$props) $$invalidate(7, selectable = $$props.selectable);
    		if ('ripple' in $$props) $$invalidate(8, ripple = $$props.ripple);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		klass,
    		activeClass,
    		dense,
    		disabled,
    		multiline,
    		link,
    		selectable,
    		ripple,
    		style,
    		role,
    		click,
    		value,
    		$$scope,
    		slots,
    		click_handler,
    		dblclick_handler
    	];
    }

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			class: 1,
    			activeClass: 2,
    			value: 12,
    			active: 0,
    			dense: 3,
    			disabled: 4,
    			multiline: 5,
    			link: 6,
    			selectable: 7,
    			ripple: 8,
    			style: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiline() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiline(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectable() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectable(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-materialify/dist/components/List/ListItemGroup.svelte generated by Svelte v3.55.1 */

    // (22:0) <ItemGroup   class="s-list-item-group {klass}"   role="listbox"   bind:value   {activeClass}   {multiple}   {mandatory}   {max}   {style}>
    function create_default_slot$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(22:0) <ItemGroup   class=\\\"s-list-item-group {klass}\\\"   role=\\\"listbox\\\"   bind:value   {activeClass}   {multiple}   {mandatory}   {max}   {style}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let itemgroup;
    	let updating_value;
    	let current;

    	function itemgroup_value_binding(value) {
    		/*itemgroup_value_binding*/ ctx[8](value);
    	}

    	let itemgroup_props = {
    		class: "s-list-item-group " + /*klass*/ ctx[1],
    		role: "listbox",
    		activeClass: /*activeClass*/ ctx[2],
    		multiple: /*multiple*/ ctx[3],
    		mandatory: /*mandatory*/ ctx[4],
    		max: /*max*/ ctx[5],
    		style: /*style*/ ctx[6],
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		itemgroup_props.value = /*value*/ ctx[0];
    	}

    	itemgroup = new ItemGroup({ props: itemgroup_props, $$inline: true });
    	binding_callbacks.push(() => bind(itemgroup, 'value', itemgroup_value_binding));

    	const block = {
    		c: function create() {
    			create_component(itemgroup.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const itemgroup_changes = {};
    			if (dirty & /*klass*/ 2) itemgroup_changes.class = "s-list-item-group " + /*klass*/ ctx[1];
    			if (dirty & /*activeClass*/ 4) itemgroup_changes.activeClass = /*activeClass*/ ctx[2];
    			if (dirty & /*multiple*/ 8) itemgroup_changes.multiple = /*multiple*/ ctx[3];
    			if (dirty & /*mandatory*/ 16) itemgroup_changes.mandatory = /*mandatory*/ ctx[4];
    			if (dirty & /*max*/ 32) itemgroup_changes.max = /*max*/ ctx[5];
    			if (dirty & /*style*/ 64) itemgroup_changes.style = /*style*/ ctx[6];

    			if (dirty & /*$$scope*/ 512) {
    				itemgroup_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				itemgroup_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			itemgroup.$set(itemgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItemGroup', slots, ['default']);
    	setContext('S_ListItemRole', 'option');
    	setContext('S_ListItemGroup', ITEM_GROUP);
    	let { class: klass = 'primary-text' } = $$props;
    	let { value = [] } = $$props;
    	let { activeClass = 'active' } = $$props;
    	let { multiple = false } = $$props;
    	let { mandatory = false } = $$props;
    	let { max = Infinity } = $$props;
    	let { style = null } = $$props;
    	const writable_props = ['class', 'value', 'activeClass', 'multiple', 'mandatory', 'max', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListItemGroup> was created with unknown prop '${key}'`);
    	});

    	function itemgroup_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('activeClass' in $$props) $$invalidate(2, activeClass = $$props.activeClass);
    		if ('multiple' in $$props) $$invalidate(3, multiple = $$props.multiple);
    		if ('mandatory' in $$props) $$invalidate(4, mandatory = $$props.mandatory);
    		if ('max' in $$props) $$invalidate(5, max = $$props.max);
    		if ('style' in $$props) $$invalidate(6, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		ItemGroup,
    		ITEM_GROUP,
    		klass,
    		value,
    		activeClass,
    		multiple,
    		mandatory,
    		max,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('activeClass' in $$props) $$invalidate(2, activeClass = $$props.activeClass);
    		if ('multiple' in $$props) $$invalidate(3, multiple = $$props.multiple);
    		if ('mandatory' in $$props) $$invalidate(4, mandatory = $$props.mandatory);
    		if ('max' in $$props) $$invalidate(5, max = $$props.max);
    		if ('style' in $$props) $$invalidate(6, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		klass,
    		activeClass,
    		multiple,
    		mandatory,
    		max,
    		style,
    		slots,
    		itemgroup_value_binding,
    		$$scope
    	];
    }

    class ListItemGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			class: 1,
    			value: 0,
    			activeClass: 2,
    			multiple: 3,
    			mandatory: 4,
    			max: 5,
    			style: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItemGroup",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mandatory() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mandatory(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ListItemGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ListItemGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-materialify/dist/components/Chip/Chip.svelte generated by Svelte v3.55.1 */
    const file$a = "node_modules/svelte-materialify/dist/components/Chip/Chip.svelte";
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});

    // (189:0) {#if active}
    function create_if_block$4(ctx) {
    	let span;
    	let t;
    	let span_class_value;
    	let Ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let if_block = /*close*/ ctx[8] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", span_class_value = "s-chip " + /*klass*/ ctx[1] + " size-" + /*size*/ ctx[3]);
    			toggle_class(span, "outlined", /*outlined*/ ctx[4]);
    			toggle_class(span, "pill", /*pill*/ ctx[5]);
    			toggle_class(span, "link", /*link*/ ctx[6]);
    			toggle_class(span, "label", /*label*/ ctx[7]);
    			toggle_class(span, "selected", /*selected*/ ctx[2]);
    			add_location(span, file$a, 189, 2, 4007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			append_dev(span, t);
    			if (if_block) if_block.m(span, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, span, /*link*/ ctx[6])),
    					listen_dev(span, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*close*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*close*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*klass, size*/ 10 && span_class_value !== (span_class_value = "s-chip " + /*klass*/ ctx[1] + " size-" + /*size*/ ctx[3])) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*link*/ 64) Ripple_action.update.call(null, /*link*/ ctx[6]);

    			if (!current || dirty & /*klass, size, outlined*/ 26) {
    				toggle_class(span, "outlined", /*outlined*/ ctx[4]);
    			}

    			if (!current || dirty & /*klass, size, pill*/ 42) {
    				toggle_class(span, "pill", /*pill*/ ctx[5]);
    			}

    			if (!current || dirty & /*klass, size, link*/ 74) {
    				toggle_class(span, "link", /*link*/ ctx[6]);
    			}

    			if (!current || dirty & /*klass, size, label*/ 138) {
    				toggle_class(span, "label", /*label*/ ctx[7]);
    			}

    			if (!current || dirty & /*klass, size, selected*/ 14) {
    				toggle_class(span, "selected", /*selected*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(189:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    // (200:4) {#if close}
    function create_if_block_1$1(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const close_icon_slot_template = /*#slots*/ ctx[11]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[10], get_close_icon_slot_context);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    			attr_dev(div, "class", "s-chip__close");
    			add_location(div, file$a, 200, 6, 4207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onClose*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (close_icon_slot) {
    				if (close_icon_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						close_icon_slot,
    						close_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(close_icon_slot_template, /*$$scope*/ ctx[10], dirty, get_close_icon_slot_changes),
    						get_close_icon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(200:4) {#if close}",
    		ctx
    	});

    	return block;
    }

    // (202:32)            
    function fallback_block$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { path: closeIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(202:32)            ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chip', slots, ['default','close-icon']);
    	let { class: klass = '' } = $$props;
    	let { active = true } = $$props;
    	let { selected = false } = $$props;
    	let { size = 'default' } = $$props;
    	let { outlined = false } = $$props;
    	let { pill = false } = $$props;
    	let { link = false } = $$props;
    	let { label = false } = $$props;
    	let { close = false } = $$props;
    	const dispatch = createEventDispatcher();

    	function onClose(e) {
    		$$invalidate(0, active = false);
    		dispatch('close', e);
    	}

    	const writable_props = [
    		'class',
    		'active',
    		'selected',
    		'size',
    		'outlined',
    		'pill',
    		'link',
    		'label',
    		'close'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chip> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(1, klass = $$props.class);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('outlined' in $$props) $$invalidate(4, outlined = $$props.outlined);
    		if ('pill' in $$props) $$invalidate(5, pill = $$props.pill);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('label' in $$props) $$invalidate(7, label = $$props.label);
    		if ('close' in $$props) $$invalidate(8, close = $$props.close);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Ripple,
    		Icon,
    		closeIcon,
    		createEventDispatcher,
    		klass,
    		active,
    		selected,
    		size,
    		outlined,
    		pill,
    		link,
    		label,
    		close,
    		dispatch,
    		onClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$props.klass);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('outlined' in $$props) $$invalidate(4, outlined = $$props.outlined);
    		if ('pill' in $$props) $$invalidate(5, pill = $$props.pill);
    		if ('link' in $$props) $$invalidate(6, link = $$props.link);
    		if ('label' in $$props) $$invalidate(7, label = $$props.label);
    		if ('close' in $$props) $$invalidate(8, close = $$props.close);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		klass,
    		selected,
    		size,
    		outlined,
    		pill,
    		link,
    		label,
    		close,
    		onClose,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Chip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			class: 1,
    			active: 0,
    			selected: 2,
    			size: 3,
    			outlined: 4,
    			pill: 5,
    			link: 6,
    			label: 7,
    			close: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chip",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pill() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pill(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-materialify/dist/components/Checkbox/Checkbox.svelte generated by Svelte v3.55.1 */
    const file$9 = "node_modules/svelte-materialify/dist/components/Checkbox/Checkbox.svelte";

    // (178:6) {#if checked || indeterminate}
    function create_if_block$3(ctx) {
    	let svg;
    	let path;
    	let path_d_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*checked*/ ctx[0] ? check : dash);
    			add_location(path, file$9, 183, 10, 4208);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$9, 178, 8, 4069);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checked*/ 1 && path_d_value !== (path_d_value = /*checked*/ ctx[0] ? check : dash)) {
    				attr_dev(path, "d", path_d_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(178:6) {#if checked || indeterminate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div2;
    	let div1;
    	let input;
    	let t0;
    	let div0;
    	let div1_class_value;
    	let TextColor_action;
    	let t1;
    	let label;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*checked*/ ctx[0] || /*indeterminate*/ ctx[1]) && create_if_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			label = element("label");
    			if (default_slot) default_slot.c();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "role", "checkbox");
    			attr_dev(input, "aria-checked", /*checked*/ ctx[0]);
    			attr_dev(input, "id", /*id*/ ctx[2]);
    			input.disabled = /*disabled*/ ctx[6];
    			input.__value = /*value*/ ctx[7];
    			input.value = input.__value;
    			if (/*checked*/ ctx[0] === void 0 || /*indeterminate*/ ctx[1] === void 0) add_render_callback(() => /*input_change_handler*/ ctx[16].call(input));
    			add_location(input, file$9, 164, 4, 3704);
    			attr_dev(div0, "class", "s-checkbox__background");
    			attr_dev(div0, "aria-hidden", "true");
    			add_location(div0, file$9, 176, 4, 3966);
    			attr_dev(div1, "class", div1_class_value = "s-checkbox__wrapper " + /*klass*/ ctx[4]);
    			toggle_class(div1, "disabled", /*disabled*/ ctx[6]);
    			add_location(div1, file$9, 159, 2, 3533);
    			attr_dev(label, "for", /*id*/ ctx[2]);
    			add_location(label, file$9, 188, 2, 4298);
    			attr_dev(div2, "class", "s-checkbox");
    			attr_dev(div2, "style", /*style*/ ctx[8]);
    			add_location(div2, file$9, 158, 0, 3497);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			/*input_binding*/ ctx[15](input);
    			input.checked = /*checked*/ ctx[0];
    			input.indeterminate = /*indeterminate*/ ctx[1];
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[16]),
    					listen_dev(input, "change", /*groupUpdate*/ ctx[9], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[14], false, false, false),
    					action_destroyer(Ripple.call(null, div1, { centered: true })),
    					action_destroyer(TextColor_action = TextColor.call(null, div1, /*checked*/ ctx[0] || /*indeterminate*/ ctx[1]
    					? /*color*/ ctx[5]
    					: false))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*checked*/ 1) {
    				attr_dev(input, "aria-checked", /*checked*/ ctx[0]);
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(input, "id", /*id*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 64) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[6]);
    			}

    			if (!current || dirty & /*value*/ 128) {
    				prop_dev(input, "__value", /*value*/ ctx[7]);
    				input.value = input.__value;
    			}

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty & /*indeterminate*/ 2) {
    				input.indeterminate = /*indeterminate*/ ctx[1];
    			}

    			if (/*checked*/ ctx[0] || /*indeterminate*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*klass*/ 16 && div1_class_value !== (div1_class_value = "s-checkbox__wrapper " + /*klass*/ ctx[4])) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (TextColor_action && is_function(TextColor_action.update) && dirty & /*checked, indeterminate, color*/ 35) TextColor_action.update.call(null, /*checked*/ ctx[0] || /*indeterminate*/ ctx[1]
    			? /*color*/ ctx[5]
    			: false);

    			if (!current || dirty & /*klass, disabled*/ 80) {
    				toggle_class(div1, "disabled", /*disabled*/ ctx[6]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(label, "for", /*id*/ ctx[2]);
    			}

    			if (!current || dirty & /*style*/ 256) {
    				attr_dev(div2, "style", /*style*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*input_binding*/ ctx[15](null);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const check = 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';
    const dash = 'M4,11L4,13L20,13L20,11L4,11Z';

    function instance$b($$self, $$props, $$invalidate) {
    	let hasValidGroup;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { color = 'primary' } = $$props;
    	let { checked = false } = $$props;
    	let { indeterminate = false } = $$props;
    	let { disabled = false } = $$props;
    	let { value = null } = $$props;
    	let { group = null } = $$props;
    	let { id = null } = $$props;
    	let { style = null } = $$props;
    	let { inputElement = null } = $$props;
    	id = id || `s-checkbox-${uid(5)}`;

    	function groupUpdate() {
    		if (hasValidGroup && value != null) {
    			const i = group.indexOf(value);

    			if (i < 0) {
    				group.push(value);
    			} else {
    				group.splice(i, 1);
    			}

    			$$invalidate(10, group);
    		}
    	}

    	const writable_props = [
    		'class',
    		'color',
    		'checked',
    		'indeterminate',
    		'disabled',
    		'value',
    		'group',
    		'id',
    		'style',
    		'inputElement'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Checkbox> was created with unknown prop '${key}'`);
    	});

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(3, inputElement);
    		});
    	}

    	function input_change_handler() {
    		checked = this.checked;
    		indeterminate = this.indeterminate;
    		((($$invalidate(0, checked), $$invalidate(11, hasValidGroup)), $$invalidate(7, value)), $$invalidate(10, group));
    		$$invalidate(1, indeterminate);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(4, klass = $$props.class);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('indeterminate' in $$props) $$invalidate(1, indeterminate = $$props.indeterminate);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('value' in $$props) $$invalidate(7, value = $$props.value);
    		if ('group' in $$props) $$invalidate(10, group = $$props.group);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('style' in $$props) $$invalidate(8, style = $$props.style);
    		if ('inputElement' in $$props) $$invalidate(3, inputElement = $$props.inputElement);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		uid,
    		check,
    		dash,
    		Ripple,
    		TextColor,
    		klass,
    		color,
    		checked,
    		indeterminate,
    		disabled,
    		value,
    		group,
    		id,
    		style,
    		inputElement,
    		groupUpdate,
    		hasValidGroup
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(4, klass = $$props.klass);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('indeterminate' in $$props) $$invalidate(1, indeterminate = $$props.indeterminate);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('value' in $$props) $$invalidate(7, value = $$props.value);
    		if ('group' in $$props) $$invalidate(10, group = $$props.group);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('style' in $$props) $$invalidate(8, style = $$props.style);
    		if ('inputElement' in $$props) $$invalidate(3, inputElement = $$props.inputElement);
    		if ('hasValidGroup' in $$props) $$invalidate(11, hasValidGroup = $$props.hasValidGroup);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*group*/ 1024) {
    			$$invalidate(11, hasValidGroup = Array.isArray(group));
    		}

    		if ($$self.$$.dirty & /*hasValidGroup, value, group*/ 3200) {
    			if (hasValidGroup && value != null) {
    				$$invalidate(0, checked = group.indexOf(value) >= 0);
    			}
    		}
    	};

    	return [
    		checked,
    		indeterminate,
    		id,
    		inputElement,
    		klass,
    		color,
    		disabled,
    		value,
    		style,
    		groupUpdate,
    		group,
    		hasValidGroup,
    		$$scope,
    		slots,
    		change_handler,
    		input_binding,
    		input_change_handler
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			class: 4,
    			color: 5,
    			checked: 0,
    			indeterminate: 1,
    			disabled: 6,
    			value: 7,
    			group: 10,
    			id: 2,
    			style: 8,
    			inputElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var down = 'M7,10L12,15L17,10H7Z';

    /* node_modules/svelte-materialify/dist/components/Select/Select.svelte generated by Svelte v3.55.1 */
    const file$8 = "node_modules/svelte-materialify/dist/components/Select/Select.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    const get_item_slot_changes = dirty => ({ item: dirty & /*items*/ 8 });
    const get_item_slot_context = ctx => ({ item: /*item*/ ctx[28] });
    const get_prepend_outer_slot_changes = dirty => ({});
    const get_prepend_outer_slot_context = ctx => ({ slot: "prepend-outer" });

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    const get_append_outer_slot_changes = dirty => ({});
    const get_append_outer_slot_context = ctx => ({ slot: "append-outer" });

    // (100:10) <ListItem {dense} value={item.value ? item.value : item}>
    function create_default_slot_4(ctx) {
    	let t_value = (/*item*/ ctx[28].name
    	? /*item*/ ctx[28].name
    	: /*item*/ ctx[28]) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 8 && t_value !== (t_value = (/*item*/ ctx[28].name
    			? /*item*/ ctx[28].name
    			: /*item*/ ctx[28]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(100:10) <ListItem {dense} value={item.value ? item.value : item}>",
    		ctx
    	});

    	return block;
    }

    // (102:14) {#if multiple}
    function create_if_block_1(ctx) {
    	let checkbox;
    	let current;

    	checkbox = new Checkbox({
    			props: {
    				checked: /*value*/ ctx[0].includes(/*item*/ ctx[28].value
    				? /*item*/ ctx[28].value
    				: /*item*/ ctx[28])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkbox_changes = {};

    			if (dirty & /*value, items*/ 9) checkbox_changes.checked = /*value*/ ctx[0].includes(/*item*/ ctx[28].value
    			? /*item*/ ctx[28].value
    			: /*item*/ ctx[28]);

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(102:14) {#if multiple}",
    		ctx
    	});

    	return block;
    }

    // (101:12) 
    function create_prepend_slot(ctx) {
    	let span;
    	let current;
    	let if_block = /*multiple*/ ctx[11] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "prepend");
    			add_location(span, file$8, 100, 12, 3149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*multiple*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*multiple*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_prepend_slot.name,
    		type: "slot",
    		source: "(101:12) ",
    		ctx
    	});

    	return block;
    }

    // (99:33)             
    function fallback_block(ctx) {
    	let listitem;
    	let t;
    	let current;

    	listitem = new ListItem({
    			props: {
    				dense: /*dense*/ ctx[7],
    				value: /*item*/ ctx[28].value
    				? /*item*/ ctx[28].value
    				: /*item*/ ctx[28],
    				$$slots: {
    					prepend: [create_prepend_slot],
    					default: [create_default_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(listitem.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(listitem, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listitem_changes = {};
    			if (dirty & /*dense*/ 128) listitem_changes.dense = /*dense*/ ctx[7];

    			if (dirty & /*items*/ 8) listitem_changes.value = /*item*/ ctx[28].value
    			? /*item*/ ctx[28].value
    			: /*item*/ ctx[28];

    			if (dirty & /*$$scope, value, items, multiple*/ 8390665) {
    				listitem_changes.$$scope = { dirty, ctx };
    			}

    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listitem, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(99:33)             ",
    		ctx
    	});

    	return block;
    }

    // (98:6) {#each items as item}
    function create_each_block_1$1(ctx) {
    	let current;
    	const item_slot_template = /*#slots*/ ctx[19].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[23], get_item_slot_context);
    	const item_slot_or_fallback = item_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (item_slot_or_fallback) item_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (item_slot_or_fallback) {
    				item_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (item_slot) {
    				if (item_slot.p && (!current || dirty & /*$$scope, items*/ 8388616)) {
    					update_slot_base(
    						item_slot,
    						item_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(item_slot_template, /*$$scope*/ ctx[23], dirty, get_item_slot_changes),
    						get_item_slot_context
    					);
    				}
    			} else {
    				if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty & /*dense, items, value, multiple*/ 2185)) {
    					item_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(98:6) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (97:4) <ListItemGroup bind:value {mandatory} {multiple} {max}>
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*items*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dense, items, value, multiple, $$scope*/ 8390793) {
    				each_value_1 = /*items*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(97:4) <ListItemGroup bind:value {mandatory} {multiple} {max}>",
    		ctx
    	});

    	return block;
    }

    // (67:2) <Menu offsetY={false} bind:active {disabled} {closeOnClick}>
    function create_default_slot_2(ctx) {
    	let listitemgroup;
    	let updating_value;
    	let current;

    	function listitemgroup_value_binding(value) {
    		/*listitemgroup_value_binding*/ ctx[21](value);
    	}

    	let listitemgroup_props = {
    		mandatory: /*mandatory*/ ctx[10],
    		multiple: /*multiple*/ ctx[11],
    		max: /*max*/ ctx[12],
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		listitemgroup_props.value = /*value*/ ctx[0];
    	}

    	listitemgroup = new ListItemGroup({
    			props: listitemgroup_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(listitemgroup, 'value', listitemgroup_value_binding));

    	const block = {
    		c: function create() {
    			create_component(listitemgroup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listitemgroup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const listitemgroup_changes = {};
    			if (dirty & /*mandatory*/ 1024) listitemgroup_changes.mandatory = /*mandatory*/ ctx[10];
    			if (dirty & /*multiple*/ 2048) listitemgroup_changes.multiple = /*multiple*/ ctx[11];
    			if (dirty & /*max*/ 4096) listitemgroup_changes.max = /*max*/ ctx[12];

    			if (dirty & /*$$scope, items, dense, value, multiple*/ 8390793) {
    				listitemgroup_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				listitemgroup_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			listitemgroup.$set(listitemgroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitemgroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitemgroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listitemgroup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(67:2) <Menu offsetY={false} bind:active {disabled} {closeOnClick}>",
    		ctx
    	});

    	return block;
    }

    // (69:6) <TextField          {filled}          {outlined}          {solo}          {dense}          {disabled}          value={items && format(value)}          {placeholder}          {hint}          readonly>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(69:6) <TextField          {filled}          {outlined}          {solo}          {dense}          {disabled}          value={items && format(value)}          {placeholder}          {hint}          readonly>",
    		ctx
    	});

    	return block;
    }

    // (79:8) 
    function create_prepend_outer_slot(ctx) {
    	let current;
    	const prepend_outer_slot_template = /*#slots*/ ctx[19]["prepend-outer"];
    	const prepend_outer_slot = create_slot(prepend_outer_slot_template, ctx, /*$$scope*/ ctx[23], get_prepend_outer_slot_context);

    	const block = {
    		c: function create() {
    			if (prepend_outer_slot) prepend_outer_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (prepend_outer_slot) {
    				prepend_outer_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prepend_outer_slot) {
    				if (prepend_outer_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						prepend_outer_slot,
    						prepend_outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(prepend_outer_slot_template, /*$$scope*/ ctx[23], dirty, get_prepend_outer_slot_changes),
    						get_prepend_outer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prepend_outer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prepend_outer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prepend_outer_slot) prepend_outer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_prepend_outer_slot.name,
    		type: "slot",
    		source: "(79:8) ",
    		ctx
    	});

    	return block;
    }

    // (83:10) {#if chips && value}
    function create_if_block$2(ctx) {
    	let span;
    	let current;

    	let each_value = Array.isArray(/*value*/ ctx[0])
    	? /*value*/ ctx[0].map(/*func*/ ctx[20])
    	: [/*getSelectString*/ ctx[17](/*value*/ ctx[0])];

    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			span = element("span");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "s-select__chips");
    			add_location(span, file$8, 83, 12, 2480);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Array, value, getSelectString*/ 131073) {
    				each_value = Array.isArray(/*value*/ ctx[0])
    				? /*value*/ ctx[0].map(/*func*/ ctx[20])
    				: [/*getSelectString*/ ctx[17](/*value*/ ctx[0])];

    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(span, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(83:10) {#if chips && value}",
    		ctx
    	});

    	return block;
    }

    // (86:16) <Chip>
    function create_default_slot$1(ctx) {
    	let t_value = /*val*/ ctx[25] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1 && t_value !== (t_value = /*val*/ ctx[25] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(86:16) <Chip>",
    		ctx
    	});

    	return block;
    }

    // (85:14) {#each Array.isArray(value) ? value.map((v) => getSelectString(v)) : [getSelectString(value)] as val}
    function create_each_block$2(ctx) {
    	let chip;
    	let current;

    	chip = new Chip({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chip_changes = {};

    			if (dirty & /*$$scope, value*/ 8388609) {
    				chip_changes.$$scope = { dirty, ctx };
    			}

    			chip.$set(chip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(85:14) {#each Array.isArray(value) ? value.map((v) => getSelectString(v)) : [getSelectString(value)] as val}",
    		ctx
    	});

    	return block;
    }

    // (82:8) 
    function create_content_slot(ctx) {
    	let div;
    	let current;
    	let if_block = /*chips*/ ctx[13] && /*value*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "slot", "content");
    			add_location(div, file$8, 81, 8, 2414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*chips*/ ctx[13] && /*value*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*chips, value*/ 8193) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(82:8) ",
    		ctx
    	});

    	return block;
    }

    // (91:8) 
    function create_append_slot(ctx) {
    	let span;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				path: down,
    				rotate: /*active*/ ctx[1] ? 180 : 0
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(icon.$$.fragment);
    			attr_dev(span, "slot", "append");
    			add_location(span, file$8, 90, 8, 2750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(icon, span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*active*/ 2) icon_changes.rotate = /*active*/ ctx[1] ? 180 : 0;
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_append_slot.name,
    		type: "slot",
    		source: "(91:8) ",
    		ctx
    	});

    	return block;
    }

    // (94:8) 
    function create_append_outer_slot(ctx) {
    	let current;
    	const append_outer_slot_template = /*#slots*/ ctx[19]["append-outer"];
    	const append_outer_slot = create_slot(append_outer_slot_template, ctx, /*$$scope*/ ctx[23], get_append_outer_slot_context);

    	const block = {
    		c: function create() {
    			if (append_outer_slot) append_outer_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (append_outer_slot) {
    				append_outer_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (append_outer_slot) {
    				if (append_outer_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						append_outer_slot,
    						append_outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(append_outer_slot_template, /*$$scope*/ ctx[23], dirty, get_append_outer_slot_changes),
    						get_append_outer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(append_outer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(append_outer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (append_outer_slot) append_outer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_append_outer_slot.name,
    		type: "slot",
    		source: "(94:8) ",
    		ctx
    	});

    	return block;
    }

    // (68:4) 
    function create_activator_slot(ctx) {
    	let span;
    	let textfield;
    	let current;

    	textfield = new TextField({
    			props: {
    				filled: /*filled*/ ctx[4],
    				outlined: /*outlined*/ ctx[5],
    				solo: /*solo*/ ctx[6],
    				dense: /*dense*/ ctx[7],
    				disabled: /*disabled*/ ctx[14],
    				value: /*items*/ ctx[3] && /*format*/ ctx[16](/*value*/ ctx[0]),
    				placeholder: /*placeholder*/ ctx[8],
    				hint: /*hint*/ ctx[9],
    				readonly: true,
    				$$slots: {
    					"append-outer": [create_append_outer_slot],
    					append: [create_append_slot],
    					content: [create_content_slot],
    					"prepend-outer": [create_prepend_outer_slot],
    					default: [create_default_slot_1$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(textfield.$$.fragment);
    			attr_dev(span, "slot", "activator");
    			add_location(span, file$8, 67, 4, 2094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(textfield, span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textfield_changes = {};
    			if (dirty & /*filled*/ 16) textfield_changes.filled = /*filled*/ ctx[4];
    			if (dirty & /*outlined*/ 32) textfield_changes.outlined = /*outlined*/ ctx[5];
    			if (dirty & /*solo*/ 64) textfield_changes.solo = /*solo*/ ctx[6];
    			if (dirty & /*dense*/ 128) textfield_changes.dense = /*dense*/ ctx[7];
    			if (dirty & /*disabled*/ 16384) textfield_changes.disabled = /*disabled*/ ctx[14];
    			if (dirty & /*items, format, value*/ 65545) textfield_changes.value = /*items*/ ctx[3] && /*format*/ ctx[16](/*value*/ ctx[0]);
    			if (dirty & /*placeholder*/ 256) textfield_changes.placeholder = /*placeholder*/ ctx[8];
    			if (dirty & /*hint*/ 512) textfield_changes.hint = /*hint*/ ctx[9];

    			if (dirty & /*$$scope, active, value, chips*/ 8396803) {
    				textfield_changes.$$scope = { dirty, ctx };
    			}

    			textfield.$set(textfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(textfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_activator_slot.name,
    		type: "slot",
    		source: "(68:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let menu;
    	let updating_active;
    	let div_class_value;
    	let current;

    	function menu_active_binding(value) {
    		/*menu_active_binding*/ ctx[22](value);
    	}

    	let menu_props = {
    		offsetY: false,
    		disabled: /*disabled*/ ctx[14],
    		closeOnClick: /*closeOnClick*/ ctx[15],
    		$$slots: {
    			activator: [create_activator_slot],
    			default: [create_default_slot_2]
    		},
    		$$scope: { ctx }
    	};

    	if (/*active*/ ctx[1] !== void 0) {
    		menu_props.active = /*active*/ ctx[1];
    	}

    	menu = new Menu({ props: menu_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu, 'active', menu_active_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(menu.$$.fragment);
    			attr_dev(div, "class", div_class_value = "s-select " + /*klass*/ ctx[2]);
    			toggle_class(div, "disabled", /*disabled*/ ctx[14]);
    			toggle_class(div, "chips", /*chips*/ ctx[13]);
    			add_location(div, file$8, 65, 0, 1967);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(menu, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menu_changes = {};
    			if (dirty & /*disabled*/ 16384) menu_changes.disabled = /*disabled*/ ctx[14];
    			if (dirty & /*closeOnClick*/ 32768) menu_changes.closeOnClick = /*closeOnClick*/ ctx[15];

    			if (dirty & /*$$scope, filled, outlined, solo, dense, disabled, items, format, value, placeholder, hint, active, chips, mandatory, multiple, max*/ 8486907) {
    				menu_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_active && dirty & /*active*/ 2) {
    				updating_active = true;
    				menu_changes.active = /*active*/ ctx[1];
    				add_flush_callback(() => updating_active = false);
    			}

    			menu.$set(menu_changes);

    			if (!current || dirty & /*klass*/ 4 && div_class_value !== (div_class_value = "s-select " + /*klass*/ ctx[2])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*klass, disabled*/ 16388) {
    				toggle_class(div, "disabled", /*disabled*/ ctx[14]);
    			}

    			if (!current || dirty & /*klass, chips*/ 8196) {
    				toggle_class(div, "chips", /*chips*/ ctx[13]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(menu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, ['append-outer','prepend-outer','default','item']);
    	let { class: klass = '' } = $$props;
    	let { active = false } = $$props;
    	let { value = [] } = $$props;
    	let { items = [] } = $$props;
    	let { filled = false } = $$props;
    	let { outlined = false } = $$props;
    	let { solo = false } = $$props;
    	let { dense = false } = $$props;
    	let { placeholder = null } = $$props;
    	let { hint = '' } = $$props;
    	let { mandatory = false } = $$props;
    	let { multiple = false } = $$props;
    	let { max = Infinity } = $$props;
    	let { chips = false } = $$props;
    	let { disabled = null } = $$props;
    	let { closeOnClick = !multiple } = $$props;
    	let { emptyString = '' } = $$props;

    	const getSelectString = v => {
    		// We could also use `return items[0].value ? find.. : v` or provide a `basic` prop
    		const item = items.find(i => i.value === v);

    		return item ? item.name ? item.name : item : v || emptyString;
    	};

    	let { format = val => Array.isArray(val)
    	? val.map(v => getSelectString(v)).join(', ')
    	: getSelectString(val) } = $$props;

    	const dispatch = createEventDispatcher();

    	const writable_props = [
    		'class',
    		'active',
    		'value',
    		'items',
    		'filled',
    		'outlined',
    		'solo',
    		'dense',
    		'placeholder',
    		'hint',
    		'mandatory',
    		'multiple',
    		'max',
    		'chips',
    		'disabled',
    		'closeOnClick',
    		'emptyString',
    		'format'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	const func = v => getSelectString(v);

    	function listitemgroup_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function menu_active_binding(value) {
    		active = value;
    		$$invalidate(1, active);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(2, klass = $$props.class);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('filled' in $$props) $$invalidate(4, filled = $$props.filled);
    		if ('outlined' in $$props) $$invalidate(5, outlined = $$props.outlined);
    		if ('solo' in $$props) $$invalidate(6, solo = $$props.solo);
    		if ('dense' in $$props) $$invalidate(7, dense = $$props.dense);
    		if ('placeholder' in $$props) $$invalidate(8, placeholder = $$props.placeholder);
    		if ('hint' in $$props) $$invalidate(9, hint = $$props.hint);
    		if ('mandatory' in $$props) $$invalidate(10, mandatory = $$props.mandatory);
    		if ('multiple' in $$props) $$invalidate(11, multiple = $$props.multiple);
    		if ('max' in $$props) $$invalidate(12, max = $$props.max);
    		if ('chips' in $$props) $$invalidate(13, chips = $$props.chips);
    		if ('disabled' in $$props) $$invalidate(14, disabled = $$props.disabled);
    		if ('closeOnClick' in $$props) $$invalidate(15, closeOnClick = $$props.closeOnClick);
    		if ('emptyString' in $$props) $$invalidate(18, emptyString = $$props.emptyString);
    		if ('format' in $$props) $$invalidate(16, format = $$props.format);
    		if ('$$scope' in $$props) $$invalidate(23, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		TextField,
    		Menu,
    		ListItemGroup,
    		ListItem,
    		Chip,
    		Checkbox,
    		Icon,
    		DOWN_ICON: down,
    		klass,
    		active,
    		value,
    		items,
    		filled,
    		outlined,
    		solo,
    		dense,
    		placeholder,
    		hint,
    		mandatory,
    		multiple,
    		max,
    		chips,
    		disabled,
    		closeOnClick,
    		emptyString,
    		getSelectString,
    		format,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(2, klass = $$props.klass);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('filled' in $$props) $$invalidate(4, filled = $$props.filled);
    		if ('outlined' in $$props) $$invalidate(5, outlined = $$props.outlined);
    		if ('solo' in $$props) $$invalidate(6, solo = $$props.solo);
    		if ('dense' in $$props) $$invalidate(7, dense = $$props.dense);
    		if ('placeholder' in $$props) $$invalidate(8, placeholder = $$props.placeholder);
    		if ('hint' in $$props) $$invalidate(9, hint = $$props.hint);
    		if ('mandatory' in $$props) $$invalidate(10, mandatory = $$props.mandatory);
    		if ('multiple' in $$props) $$invalidate(11, multiple = $$props.multiple);
    		if ('max' in $$props) $$invalidate(12, max = $$props.max);
    		if ('chips' in $$props) $$invalidate(13, chips = $$props.chips);
    		if ('disabled' in $$props) $$invalidate(14, disabled = $$props.disabled);
    		if ('closeOnClick' in $$props) $$invalidate(15, closeOnClick = $$props.closeOnClick);
    		if ('emptyString' in $$props) $$invalidate(18, emptyString = $$props.emptyString);
    		if ('format' in $$props) $$invalidate(16, format = $$props.format);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			dispatch('change', value);
    		}
    	};

    	return [
    		value,
    		active,
    		klass,
    		items,
    		filled,
    		outlined,
    		solo,
    		dense,
    		placeholder,
    		hint,
    		mandatory,
    		multiple,
    		max,
    		chips,
    		disabled,
    		closeOnClick,
    		format,
    		getSelectString,
    		emptyString,
    		slots,
    		func,
    		listitemgroup_value_binding,
    		menu_active_binding,
    		$$scope
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 2,
    			active: 1,
    			value: 0,
    			items: 3,
    			filled: 4,
    			outlined: 5,
    			solo: 6,
    			dense: 7,
    			placeholder: 8,
    			hint: 9,
    			mandatory: 10,
    			multiple: 11,
    			max: 12,
    			chips: 13,
    			disabled: 14,
    			closeOnClick: 15,
    			emptyString: 18,
    			format: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get solo() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set solo(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hint() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hint(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mandatory() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mandatory(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chips() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chips(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnClick() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnClick(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyString() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyString(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get format() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-materialify/dist/components/Grid/Row.svelte generated by Svelte v3.55.1 */

    const file$7 = "node_modules/svelte-materialify/dist/components/Grid/Row.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "s-row " + /*klass*/ ctx[0]);
    			attr_dev(div, "style", /*style*/ ctx[3]);
    			toggle_class(div, "dense", /*dense*/ ctx[1]);
    			toggle_class(div, "no-gutters", /*noGutters*/ ctx[2]);
    			add_location(div, file$7, 34, 0, 589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div_class_value !== (div_class_value = "s-row " + /*klass*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 8) {
    				attr_dev(div, "style", /*style*/ ctx[3]);
    			}

    			if (!current || dirty & /*klass, dense*/ 3) {
    				toggle_class(div, "dense", /*dense*/ ctx[1]);
    			}

    			if (!current || dirty & /*klass, noGutters*/ 5) {
    				toggle_class(div, "no-gutters", /*noGutters*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { dense = false } = $$props;
    	let { noGutters = false } = $$props;
    	let { style = null } = $$props;
    	const writable_props = ['class', 'dense', 'noGutters', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('dense' in $$props) $$invalidate(1, dense = $$props.dense);
    		if ('noGutters' in $$props) $$invalidate(2, noGutters = $$props.noGutters);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ klass, dense, noGutters, style });

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('dense' in $$props) $$invalidate(1, dense = $$props.dense);
    		if ('noGutters' in $$props) $$invalidate(2, noGutters = $$props.noGutters);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [klass, dense, noGutters, style, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 0,
    			dense: 1,
    			noGutters: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/DateInput.svelte generated by Svelte v3.55.1 */

    const file$6 = "src/ui/DateInput.svelte";

    function create_fragment$8(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "date");
    			attr_dev(input, "class", "input-item svelte-1bcbae2");
    			add_location(input, file$6, 4, 4, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateInput', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateInput> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DateInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateInput",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/ui/Radio.svelte generated by Svelte v3.55.1 */

    const file$5 = "src/ui/Radio.svelte";

    // (11:4) {#if type === "radio"}
    function create_if_block$1(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label_1;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(/*label*/ ctx[5]);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*id*/ ctx[2]);
    			input.__value = /*value*/ ctx[4];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-13fw5qk");
    			/*$$binding_groups*/ ctx[8][0].push(input);
    			add_location(input, file$5, 12, 8, 193);
    			attr_dev(label_1, "for", /*name*/ ctx[1]);
    			attr_dev(label_1, "class", "svelte-13fw5qk");
    			add_location(label_1, file$5, 13, 8, 289);
    			attr_dev(div, "class", "radio-group svelte-13fw5qk");
    			add_location(div, file$5, 11, 4, 159);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = input.__value === /*groupName*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler*/ ctx[6], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (dirty & /*id*/ 4) {
    				attr_dev(input, "id", /*id*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 16) {
    				prop_dev(input, "__value", /*value*/ ctx[4]);
    				input.value = input.__value;
    			}

    			if (dirty & /*groupName*/ 1) {
    				input.checked = input.__value === /*groupName*/ ctx[0];
    			}

    			if (dirty & /*label*/ 32) set_data_dev(t1, /*label*/ ctx[5]);

    			if (dirty & /*name*/ 2) {
    				attr_dev(label_1, "for", /*name*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[8][0].splice(/*$$binding_groups*/ ctx[8][0].indexOf(input), 1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(11:4) {#if type === \\\"radio\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*type*/ ctx[3] === "radio" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*type*/ ctx[3] === "radio") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Radio', slots, []);
    	let { name } = $$props;
    	let { id } = $$props;
    	let { type } = $$props;
    	let { value } = $$props;
    	let { label } = $$props;
    	let { groupName } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Radio> was created without expected prop 'name'");
    		}

    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Radio> was created without expected prop 'id'");
    		}

    		if (type === undefined && !('type' in $$props || $$self.$$.bound[$$self.$$.props['type']])) {
    			console.warn("<Radio> was created without expected prop 'type'");
    		}

    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<Radio> was created without expected prop 'value'");
    		}

    		if (label === undefined && !('label' in $$props || $$self.$$.bound[$$self.$$.props['label']])) {
    			console.warn("<Radio> was created without expected prop 'label'");
    		}

    		if (groupName === undefined && !('groupName' in $$props || $$self.$$.bound[$$self.$$.props['groupName']])) {
    			console.warn("<Radio> was created without expected prop 'groupName'");
    		}
    	});

    	const writable_props = ['name', 'id', 'type', 'value', 'label', 'groupName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Radio> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		groupName = this.__value;
    		$$invalidate(0, groupName);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('groupName' in $$props) $$invalidate(0, groupName = $$props.groupName);
    	};

    	$$self.$capture_state = () => ({ name, id, type, value, label, groupName });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('groupName' in $$props) $$invalidate(0, groupName = $$props.groupName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		groupName,
    		name,
    		id,
    		type,
    		value,
    		label,
    		input_handler,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class Radio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			name: 1,
    			id: 2,
    			type: 3,
    			value: 4,
    			label: 5,
    			groupName: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Radio",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get name() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupName() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupName(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/Button.svelte generated by Svelte v3.55.1 */

    const file$4 = "src/ui/Button.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*caption*/ ctx[0]);

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*changeBtnStyle*/ ctx[1] === 'true'
    			? 'btn btn-md btn-blue'
    			: 'btn btn-sm btn-blue btn-rounded-md') + " svelte-1uuk6ue"));

    			add_location(button, file$4, 5, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*caption*/ 1) set_data_dev(t, /*caption*/ ctx[0]);

    			if (dirty & /*changeBtnStyle*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*changeBtnStyle*/ ctx[1] === 'true'
    			? 'btn btn-md btn-blue'
    			: 'btn btn-sm btn-blue btn-rounded-md') + " svelte-1uuk6ue"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { caption } = $$props;
    	let { changeBtnStyle } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (caption === undefined && !('caption' in $$props || $$self.$$.bound[$$self.$$.props['caption']])) {
    			console.warn("<Button> was created without expected prop 'caption'");
    		}

    		if (changeBtnStyle === undefined && !('changeBtnStyle' in $$props || $$self.$$.bound[$$self.$$.props['changeBtnStyle']])) {
    			console.warn("<Button> was created without expected prop 'changeBtnStyle'");
    		}
    	});

    	const writable_props = ['caption', 'changeBtnStyle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('changeBtnStyle' in $$props) $$invalidate(1, changeBtnStyle = $$props.changeBtnStyle);
    	};

    	$$self.$capture_state = () => ({ caption, changeBtnStyle });

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate(0, caption = $$props.caption);
    		if ('changeBtnStyle' in $$props) $$invalidate(1, changeBtnStyle = $$props.changeBtnStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [caption, changeBtnStyle, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { caption: 0, changeBtnStyle: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get caption() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changeBtnStyle() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changeBtnStyle(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/TicketBooking.svelte generated by Svelte v3.55.1 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/TicketBooking.svelte";

    // (57:12) <Select {items} bind:value>
    function create_default_slot_1(ctx) {
    	let t_value = APP_CONSTANTS.SELECT_CITY.FROM + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(57:12) <Select {items} bind:value>",
    		ctx
    	});

    	return block;
    }

    // (58:12) <Select {items} bind:value>
    function create_default_slot(ctx) {
    	let t_value = APP_CONSTANTS.SELECT_CITY.TO + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(58:12) <Select {items} bind:value>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div5;
    	let div0;
    	let radio0;
    	let t0;
    	let radio1;
    	let t1;
    	let div4;
    	let div2;
    	let select0;
    	let updating_value;
    	let t2;
    	let select1;
    	let updating_value_1;
    	let t3;
    	let div1;
    	let dateinput0;
    	let t4;
    	let dateinput1;
    	let t5;
    	let div3;
    	let button;
    	let current;

    	radio0 = new Radio({
    			props: {
    				type: "radio",
    				name: "tripOption",
    				value: "one-way",
    				id: "one-way",
    				label: "One - way",
    				groupName: /*selectedTripOption*/ ctx[2]
    			},
    			$$inline: true
    		});

    	radio0.$on("input", /*input_handler*/ ctx[5]);

    	radio1 = new Radio({
    			props: {
    				type: "radio",
    				name: "tripOption",
    				value: "round-trip",
    				id: "round-trip",
    				label: "Round trip",
    				groupName: "tripOption"
    			},
    			$$inline: true
    		});

    	radio1.$on("input", /*input_handler_1*/ ctx[6]);

    	function select0_value_binding(value) {
    		/*select0_value_binding*/ ctx[7](value);
    	}

    	let select0_props = {
    		items: /*items*/ ctx[3],
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[4] !== void 0) {
    		select0_props.value = /*value*/ ctx[4];
    	}

    	select0 = new Select({ props: select0_props, $$inline: true });
    	binding_callbacks.push(() => bind(select0, 'value', select0_value_binding));

    	function select1_value_binding(value) {
    		/*select1_value_binding*/ ctx[8](value);
    	}

    	let select1_props = {
    		items: /*items*/ ctx[3],
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[4] !== void 0) {
    		select1_props.value = /*value*/ ctx[4];
    	}

    	select1 = new Select({ props: select1_props, $$inline: true });
    	binding_callbacks.push(() => bind(select1, 'value', select1_value_binding));
    	dateinput0 = new DateInput({ $$inline: true });
    	dateinput1 = new DateInput({ $$inline: true });

    	button = new Button({
    			props: {
    				btnClass: "btn-blue",
    				caption: /*btnText*/ ctx[1],
    				changeBtnStyle: "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			create_component(radio0.$$.fragment);
    			t0 = space();
    			create_component(radio1.$$.fragment);
    			t1 = space();
    			div4 = element("div");
    			div2 = element("div");
    			create_component(select0.$$.fragment);
    			t2 = space();
    			create_component(select1.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(dateinput0.$$.fragment);
    			t4 = space();
    			create_component(dateinput1.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "radiogroup-wrapper d-flex svelte-1i2ash3");
    			add_location(div0, file$3, 33, 4, 880);
    			attr_dev(div1, "class", "date-input-wrapper d-flex svelte-1i2ash3");
    			add_location(div1, file$3, 59, 12, 1710);
    			attr_dev(div2, "class", "input-group-wrapper d-flex svelte-1i2ash3");
    			add_location(div2, file$3, 54, 8, 1495);
    			attr_dev(div3, "class", "button-wrapper d-flex flex-end svelte-1i2ash3");
    			add_location(div3, file$3, 65, 8, 1862);
    			attr_dev(div4, "class", "svelte-1i2ash3");
    			toggle_class(div4, "flex-row-layout", /*changeFormLayout*/ ctx[0]);
    			add_location(div4, file$3, 53, 4, 1440);
    			attr_dev(div5, "class", "form-wrapper svelte-1i2ash3");
    			add_location(div5, file$3, 32, 0, 849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			mount_component(radio0, div0, null);
    			append_dev(div0, t0);
    			mount_component(radio1, div0, null);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			mount_component(select0, div2, null);
    			append_dev(div2, t2);
    			mount_component(select1, div2, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			mount_component(dateinput0, div1, null);
    			append_dev(div1, t4);
    			mount_component(dateinput1, div1, null);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			mount_component(button, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const radio0_changes = {};
    			if (dirty & /*selectedTripOption*/ 4) radio0_changes.groupName = /*selectedTripOption*/ ctx[2];
    			radio0.$set(radio0_changes);
    			const select0_changes = {};
    			if (dirty & /*items*/ 8) select0_changes.items = /*items*/ ctx[3];

    			if (dirty & /*$$scope*/ 4096) {
    				select0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 16) {
    				updating_value = true;
    				select0_changes.value = /*value*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			select0.$set(select0_changes);
    			const select1_changes = {};
    			if (dirty & /*items*/ 8) select1_changes.items = /*items*/ ctx[3];

    			if (dirty & /*$$scope*/ 4096) {
    				select1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*value*/ 16) {
    				updating_value_1 = true;
    				select1_changes.value = /*value*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			select1.$set(select1_changes);
    			const button_changes = {};
    			if (dirty & /*btnText*/ 2) button_changes.caption = /*btnText*/ ctx[1];
    			button.$set(button_changes);

    			if (!current || dirty & /*changeFormLayout*/ 1) {
    				toggle_class(div4, "flex-row-layout", /*changeFormLayout*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radio0.$$.fragment, local);
    			transition_in(radio1.$$.fragment, local);
    			transition_in(select0.$$.fragment, local);
    			transition_in(select1.$$.fragment, local);
    			transition_in(dateinput0.$$.fragment, local);
    			transition_in(dateinput1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radio0.$$.fragment, local);
    			transition_out(radio1.$$.fragment, local);
    			transition_out(select0.$$.fragment, local);
    			transition_out(select1.$$.fragment, local);
    			transition_out(dateinput0.$$.fragment, local);
    			transition_out(dateinput1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(radio0);
    			destroy_component(radio1);
    			destroy_component(select0);
    			destroy_component(select1);
    			destroy_component(dateinput0);
    			destroy_component(dateinput1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TicketBooking', slots, []);
    	let { changeFormLayout } = $$props;
    	let { btnText } = $$props;
    	let selectedTripOption = "one-way";
    	let citiesUrl = APP_CONSTANTS.SELECT_CITY.URL;
    	let items = [];
    	let test = "airport_name";
    	let value = test;

    	async function fetchCities(url) {
    		await fetch(url).then(response => response.json()).then(data => {
    			$$invalidate(3, items = data);
    			console.log(items);
    		}).catch(error => {
    			console.log(error);
    			return [];
    		});
    	}

    	onMount(() => {
    		fetchCities(citiesUrl);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (changeFormLayout === undefined && !('changeFormLayout' in $$props || $$self.$$.bound[$$self.$$.props['changeFormLayout']])) {
    			console_1$1.warn("<TicketBooking> was created without expected prop 'changeFormLayout'");
    		}

    		if (btnText === undefined && !('btnText' in $$props || $$self.$$.bound[$$self.$$.props['btnText']])) {
    			console_1$1.warn("<TicketBooking> was created without expected prop 'btnText'");
    		}
    	});

    	const writable_props = ['changeFormLayout', 'btnText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<TicketBooking> was created with unknown prop '${key}'`);
    	});

    	const input_handler = event => $$invalidate(2, selectedTripOption = event.target.value);
    	const input_handler_1 = event => $$invalidate(2, selectedTripOption = event.target.value);

    	function select0_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(4, value);
    	}

    	function select1_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(4, value);
    	}

    	$$self.$$set = $$props => {
    		if ('changeFormLayout' in $$props) $$invalidate(0, changeFormLayout = $$props.changeFormLayout);
    		if ('btnText' in $$props) $$invalidate(1, btnText = $$props.btnText);
    	};

    	$$self.$capture_state = () => ({
    		Row,
    		Select,
    		MaterialApp,
    		DateInput,
    		Radio,
    		Button,
    		APP_CONSTANTS,
    		onMount,
    		changeFormLayout,
    		btnText,
    		selectedTripOption,
    		citiesUrl,
    		items,
    		test,
    		value,
    		fetchCities
    	});

    	$$self.$inject_state = $$props => {
    		if ('changeFormLayout' in $$props) $$invalidate(0, changeFormLayout = $$props.changeFormLayout);
    		if ('btnText' in $$props) $$invalidate(1, btnText = $$props.btnText);
    		if ('selectedTripOption' in $$props) $$invalidate(2, selectedTripOption = $$props.selectedTripOption);
    		if ('citiesUrl' in $$props) citiesUrl = $$props.citiesUrl;
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('test' in $$props) test = $$props.test;
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		changeFormLayout,
    		btnText,
    		selectedTripOption,
    		items,
    		value,
    		input_handler,
    		input_handler_1,
    		select0_value_binding,
    		select1_value_binding
    	];
    }

    class TicketBooking extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { changeFormLayout: 0, btnText: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TicketBooking",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get changeFormLayout() {
    		throw new Error("<TicketBooking>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changeFormLayout(value) {
    		throw new Error("<TicketBooking>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get btnText() {
    		throw new Error("<TicketBooking>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btnText(value) {
    		throw new Error("<TicketBooking>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const close = { close: { width: 1408, height: 1792, paths: [{ d: 'M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z' }] } };

    /* src/ui/Table.svelte generated by Svelte v3.55.1 */
    const file$2 = "src/ui/Table.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (10:16) {#each thItems as thItem}
    function create_each_block$1(ctx) {
    	let th;
    	let t_value = /*thItem*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-8f2fnu");
    			add_location(th, file$2, 10, 20, 226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*thItems*/ 1 && t_value !== (t_value = /*thItem*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:16) {#each thItems as thItem}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr0;
    	let t0;
    	let tbody;
    	let tr1;
    	let td0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let p2;
    	let t6;
    	let td1;
    	let t8;
    	let td2;
    	let p3;
    	let t10;
    	let p4;
    	let t12;
    	let td3;
    	let p5;
    	let t14;
    	let td4;
    	let button0;
    	let t15;
    	let tr2;
    	let td5;
    	let p6;
    	let t17;
    	let p7;
    	let t19;
    	let p8;
    	let t21;
    	let td6;
    	let t23;
    	let td7;
    	let p9;
    	let t25;
    	let p10;
    	let t27;
    	let td8;
    	let p11;
    	let t29;
    	let td9;
    	let button1;
    	let t30;
    	let tr3;
    	let td10;
    	let p12;
    	let t32;
    	let p13;
    	let t34;
    	let p14;
    	let t36;
    	let td11;
    	let t38;
    	let td12;
    	let p15;
    	let t40;
    	let p16;
    	let t42;
    	let td13;
    	let p17;
    	let t44;
    	let td14;
    	let button2;
    	let t45;
    	let tr4;
    	let td15;
    	let p18;
    	let t47;
    	let p19;
    	let t49;
    	let p20;
    	let t51;
    	let td16;
    	let t53;
    	let td17;
    	let p21;
    	let t55;
    	let p22;
    	let t57;
    	let td18;
    	let p23;
    	let t59;
    	let td19;
    	let button3;
    	let t60;
    	let tr5;
    	let td20;
    	let p24;
    	let t62;
    	let p25;
    	let t64;
    	let p26;
    	let t66;
    	let td21;
    	let t68;
    	let td22;
    	let p27;
    	let t70;
    	let p28;
    	let t72;
    	let td23;
    	let p29;
    	let t74;
    	let td24;
    	let button4;
    	let t75;
    	let tr6;
    	let td25;
    	let p30;
    	let t77;
    	let p31;
    	let t79;
    	let p32;
    	let t81;
    	let td26;
    	let t83;
    	let td27;
    	let p33;
    	let t85;
    	let p34;
    	let t87;
    	let td28;
    	let p35;
    	let t89;
    	let td29;
    	let button5;
    	let current;
    	let each_value = /*thItems*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	button0 = new Button({
    			props: {
    				caption: "Book",
    				btnClass: "btn-blue btn-rounded-md",
    				changeBtnStyle: true
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				caption: "Book",
    				btnClass: "btn-blue btn-rounded-md",
    				changeBtnStyle: true
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				caption: "Book",
    				btnClass: "btn-blue btn-rounded-md",
    				changeBtnStyle: true
    			},
    			$$inline: true
    		});

    	button3 = new Button({
    			props: {
    				caption: "Book",
    				btnClass: "btn-blue btn-rounded-md",
    				changeBtnStyle: true
    			},
    			$$inline: true
    		});

    	button4 = new Button({
    			props: {
    				caption: "Book",
    				btnClass: "btn-blue btn-rounded-md",
    				changeBtnStyle: true
    			},
    			$$inline: true
    		});

    	button5 = new Button({
    			props: {
    				caption: "Book",
    				btnClass: "btn-blue btn-rounded-md",
    				changeBtnStyle: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			p0 = element("p");
    			p0.textContent = "Spicejet";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "MAA , Chennai";
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = "10:30";
    			t6 = space();
    			td1 = element("td");
    			td1.textContent = "2h 40m";
    			t8 = space();
    			td2 = element("td");
    			p3 = element("p");
    			p3.textContent = "DEL , New Delhi";
    			t10 = space();
    			p4 = element("p");
    			p4.textContent = "13:10";
    			t12 = space();
    			td3 = element("td");
    			p5 = element("p");
    			p5.textContent = "5654";
    			t14 = space();
    			td4 = element("td");
    			create_component(button0.$$.fragment);
    			t15 = space();
    			tr2 = element("tr");
    			td5 = element("td");
    			p6 = element("p");
    			p6.textContent = "Spicejet";
    			t17 = space();
    			p7 = element("p");
    			p7.textContent = "MAA , Chennai";
    			t19 = space();
    			p8 = element("p");
    			p8.textContent = "10:30";
    			t21 = space();
    			td6 = element("td");
    			td6.textContent = "2h 40m";
    			t23 = space();
    			td7 = element("td");
    			p9 = element("p");
    			p9.textContent = "DEL , New Delhi";
    			t25 = space();
    			p10 = element("p");
    			p10.textContent = "13:10";
    			t27 = space();
    			td8 = element("td");
    			p11 = element("p");
    			p11.textContent = "5654";
    			t29 = space();
    			td9 = element("td");
    			create_component(button1.$$.fragment);
    			t30 = space();
    			tr3 = element("tr");
    			td10 = element("td");
    			p12 = element("p");
    			p12.textContent = "Spicejet";
    			t32 = space();
    			p13 = element("p");
    			p13.textContent = "MAA , Chennai";
    			t34 = space();
    			p14 = element("p");
    			p14.textContent = "10:30";
    			t36 = space();
    			td11 = element("td");
    			td11.textContent = "2h 40m";
    			t38 = space();
    			td12 = element("td");
    			p15 = element("p");
    			p15.textContent = "DEL , New Delhi";
    			t40 = space();
    			p16 = element("p");
    			p16.textContent = "13:10";
    			t42 = space();
    			td13 = element("td");
    			p17 = element("p");
    			p17.textContent = "5654";
    			t44 = space();
    			td14 = element("td");
    			create_component(button2.$$.fragment);
    			t45 = space();
    			tr4 = element("tr");
    			td15 = element("td");
    			p18 = element("p");
    			p18.textContent = "Spicejet";
    			t47 = space();
    			p19 = element("p");
    			p19.textContent = "MAA , Chennai";
    			t49 = space();
    			p20 = element("p");
    			p20.textContent = "10:30";
    			t51 = space();
    			td16 = element("td");
    			td16.textContent = "2h 40m";
    			t53 = space();
    			td17 = element("td");
    			p21 = element("p");
    			p21.textContent = "DEL , New Delhi";
    			t55 = space();
    			p22 = element("p");
    			p22.textContent = "13:10";
    			t57 = space();
    			td18 = element("td");
    			p23 = element("p");
    			p23.textContent = "5654";
    			t59 = space();
    			td19 = element("td");
    			create_component(button3.$$.fragment);
    			t60 = space();
    			tr5 = element("tr");
    			td20 = element("td");
    			p24 = element("p");
    			p24.textContent = "Spicejet";
    			t62 = space();
    			p25 = element("p");
    			p25.textContent = "MAA , Chennai";
    			t64 = space();
    			p26 = element("p");
    			p26.textContent = "10:30";
    			t66 = space();
    			td21 = element("td");
    			td21.textContent = "2h 40m";
    			t68 = space();
    			td22 = element("td");
    			p27 = element("p");
    			p27.textContent = "DEL , New Delhi";
    			t70 = space();
    			p28 = element("p");
    			p28.textContent = "13:10";
    			t72 = space();
    			td23 = element("td");
    			p29 = element("p");
    			p29.textContent = "5654";
    			t74 = space();
    			td24 = element("td");
    			create_component(button4.$$.fragment);
    			t75 = space();
    			tr6 = element("tr");
    			td25 = element("td");
    			p30 = element("p");
    			p30.textContent = "Spicejet";
    			t77 = space();
    			p31 = element("p");
    			p31.textContent = "MAA , Chennai";
    			t79 = space();
    			p32 = element("p");
    			p32.textContent = "10:30";
    			t81 = space();
    			td26 = element("td");
    			td26.textContent = "2h 40m";
    			t83 = space();
    			td27 = element("td");
    			p33 = element("p");
    			p33.textContent = "DEL , New Delhi";
    			t85 = space();
    			p34 = element("p");
    			p34.textContent = "13:10";
    			t87 = space();
    			td28 = element("td");
    			p35 = element("p");
    			p35.textContent = "5654";
    			t89 = space();
    			td29 = element("td");
    			create_component(button5.$$.fragment);
    			attr_dev(tr0, "class", "svelte-8f2fnu");
    			add_location(tr0, file$2, 8, 12, 159);
    			add_location(thead, file$2, 7, 8, 139);
    			attr_dev(p0, "class", "text-grey text-md mb-0_2 svelte-8f2fnu");
    			add_location(p0, file$2, 17, 20, 378);
    			attr_dev(p1, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p1, file$2, 18, 20, 447);
    			attr_dev(p2, "class", "text-sm text-bold mb-0_2 svelte-8f2fnu");
    			add_location(p2, file$2, 19, 20, 513);
    			attr_dev(td0, "class", "svelte-8f2fnu");
    			add_location(td0, file$2, 16, 16, 353);
    			attr_dev(td1, "class", "svelte-8f2fnu");
    			add_location(td1, file$2, 22, 16, 598);
    			attr_dev(p3, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p3, file$2, 27, 20, 695);
    			attr_dev(p4, "class", "text-sm text-bold svelte-8f2fnu");
    			add_location(p4, file$2, 28, 20, 763);
    			attr_dev(td2, "class", "svelte-8f2fnu");
    			add_location(td2, file$2, 26, 16, 670);
    			attr_dev(p5, "class", "text-lg text-bold svelte-8f2fnu");
    			add_location(p5, file$2, 31, 20, 865);
    			attr_dev(td3, "class", "svelte-8f2fnu");
    			add_location(td3, file$2, 30, 16, 840);
    			attr_dev(td4, "class", "svelte-8f2fnu");
    			add_location(td4, file$2, 33, 16, 941);
    			attr_dev(tr1, "class", "svelte-8f2fnu");
    			add_location(tr1, file$2, 15, 12, 332);
    			attr_dev(p6, "class", "text-grey text-md mb-0_2 svelte-8f2fnu");
    			add_location(p6, file$2, 39, 20, 1154);
    			attr_dev(p7, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p7, file$2, 40, 20, 1223);
    			attr_dev(p8, "class", "text-sm text-bold mb-0_2 svelte-8f2fnu");
    			add_location(p8, file$2, 41, 20, 1289);
    			attr_dev(td5, "class", "svelte-8f2fnu");
    			add_location(td5, file$2, 38, 16, 1129);
    			attr_dev(td6, "class", "svelte-8f2fnu");
    			add_location(td6, file$2, 44, 16, 1374);
    			attr_dev(p9, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p9, file$2, 49, 20, 1471);
    			attr_dev(p10, "class", "text-sm text-bold svelte-8f2fnu");
    			add_location(p10, file$2, 50, 20, 1539);
    			attr_dev(td7, "class", "svelte-8f2fnu");
    			add_location(td7, file$2, 48, 16, 1446);
    			attr_dev(p11, "class", "text-lg text-bold svelte-8f2fnu");
    			add_location(p11, file$2, 53, 20, 1641);
    			attr_dev(td8, "class", "svelte-8f2fnu");
    			add_location(td8, file$2, 52, 16, 1616);
    			attr_dev(td9, "class", "svelte-8f2fnu");
    			add_location(td9, file$2, 55, 16, 1717);
    			attr_dev(tr2, "class", "svelte-8f2fnu");
    			add_location(tr2, file$2, 37, 12, 1108);
    			attr_dev(p12, "class", "text-grey text-md mb-0_2 svelte-8f2fnu");
    			add_location(p12, file$2, 61, 20, 1930);
    			attr_dev(p13, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p13, file$2, 62, 20, 1999);
    			attr_dev(p14, "class", "text-sm text-bold mb-0_2 svelte-8f2fnu");
    			add_location(p14, file$2, 63, 20, 2065);
    			attr_dev(td10, "class", "svelte-8f2fnu");
    			add_location(td10, file$2, 60, 16, 1905);
    			attr_dev(td11, "class", "svelte-8f2fnu");
    			add_location(td11, file$2, 66, 16, 2150);
    			attr_dev(p15, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p15, file$2, 71, 20, 2247);
    			attr_dev(p16, "class", "text-sm text-bold svelte-8f2fnu");
    			add_location(p16, file$2, 72, 20, 2315);
    			attr_dev(td12, "class", "svelte-8f2fnu");
    			add_location(td12, file$2, 70, 16, 2222);
    			attr_dev(p17, "class", "text-lg text-bold svelte-8f2fnu");
    			add_location(p17, file$2, 75, 20, 2417);
    			attr_dev(td13, "class", "svelte-8f2fnu");
    			add_location(td13, file$2, 74, 16, 2392);
    			attr_dev(td14, "class", "svelte-8f2fnu");
    			add_location(td14, file$2, 77, 16, 2493);
    			attr_dev(tr3, "class", "svelte-8f2fnu");
    			add_location(tr3, file$2, 59, 12, 1884);
    			attr_dev(p18, "class", "text-grey text-md mb-0_2 svelte-8f2fnu");
    			add_location(p18, file$2, 83, 20, 2706);
    			attr_dev(p19, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p19, file$2, 84, 20, 2775);
    			attr_dev(p20, "class", "text-sm text-bold mb-0_2 svelte-8f2fnu");
    			add_location(p20, file$2, 85, 20, 2841);
    			attr_dev(td15, "class", "svelte-8f2fnu");
    			add_location(td15, file$2, 82, 16, 2681);
    			attr_dev(td16, "class", "svelte-8f2fnu");
    			add_location(td16, file$2, 88, 16, 2926);
    			attr_dev(p21, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p21, file$2, 93, 20, 3023);
    			attr_dev(p22, "class", "text-sm text-bold svelte-8f2fnu");
    			add_location(p22, file$2, 94, 20, 3091);
    			attr_dev(td17, "class", "svelte-8f2fnu");
    			add_location(td17, file$2, 92, 16, 2998);
    			attr_dev(p23, "class", "text-lg text-bold svelte-8f2fnu");
    			add_location(p23, file$2, 97, 20, 3193);
    			attr_dev(td18, "class", "svelte-8f2fnu");
    			add_location(td18, file$2, 96, 16, 3168);
    			attr_dev(td19, "class", "svelte-8f2fnu");
    			add_location(td19, file$2, 99, 16, 3269);
    			attr_dev(tr4, "class", "svelte-8f2fnu");
    			add_location(tr4, file$2, 81, 12, 2660);
    			attr_dev(p24, "class", "text-grey text-md mb-0_2 svelte-8f2fnu");
    			add_location(p24, file$2, 105, 20, 3482);
    			attr_dev(p25, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p25, file$2, 106, 20, 3551);
    			attr_dev(p26, "class", "text-sm text-bold mb-0_2 svelte-8f2fnu");
    			add_location(p26, file$2, 107, 20, 3617);
    			attr_dev(td20, "class", "svelte-8f2fnu");
    			add_location(td20, file$2, 104, 16, 3457);
    			attr_dev(td21, "class", "svelte-8f2fnu");
    			add_location(td21, file$2, 110, 16, 3702);
    			attr_dev(p27, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p27, file$2, 115, 20, 3799);
    			attr_dev(p28, "class", "text-sm text-bold svelte-8f2fnu");
    			add_location(p28, file$2, 116, 20, 3867);
    			attr_dev(td22, "class", "svelte-8f2fnu");
    			add_location(td22, file$2, 114, 16, 3774);
    			attr_dev(p29, "class", "text-lg text-bold svelte-8f2fnu");
    			add_location(p29, file$2, 119, 20, 3969);
    			attr_dev(td23, "class", "svelte-8f2fnu");
    			add_location(td23, file$2, 118, 16, 3944);
    			attr_dev(td24, "class", "svelte-8f2fnu");
    			add_location(td24, file$2, 121, 16, 4045);
    			attr_dev(tr5, "class", "svelte-8f2fnu");
    			add_location(tr5, file$2, 103, 12, 3436);
    			attr_dev(p30, "class", "text-grey text-md mb-0_2 svelte-8f2fnu");
    			add_location(p30, file$2, 127, 20, 4258);
    			attr_dev(p31, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p31, file$2, 128, 20, 4327);
    			attr_dev(p32, "class", "text-sm text-bold mb-0_2 svelte-8f2fnu");
    			add_location(p32, file$2, 129, 20, 4393);
    			attr_dev(td25, "class", "svelte-8f2fnu");
    			add_location(td25, file$2, 126, 16, 4233);
    			attr_dev(td26, "class", "svelte-8f2fnu");
    			add_location(td26, file$2, 132, 16, 4478);
    			attr_dev(p33, "class", "city-name mb-0_2 svelte-8f2fnu");
    			add_location(p33, file$2, 137, 20, 4575);
    			attr_dev(p34, "class", "text-sm text-bold svelte-8f2fnu");
    			add_location(p34, file$2, 138, 20, 4643);
    			attr_dev(td27, "class", "svelte-8f2fnu");
    			add_location(td27, file$2, 136, 16, 4550);
    			attr_dev(p35, "class", "text-lg text-bold svelte-8f2fnu");
    			add_location(p35, file$2, 141, 20, 4745);
    			attr_dev(td28, "class", "svelte-8f2fnu");
    			add_location(td28, file$2, 140, 16, 4720);
    			attr_dev(td29, "class", "svelte-8f2fnu");
    			add_location(td29, file$2, 143, 16, 4821);
    			attr_dev(tr6, "class", "svelte-8f2fnu");
    			add_location(tr6, file$2, 125, 12, 4212);
    			add_location(tbody, file$2, 14, 8, 312);
    			attr_dev(table, "class", "table svelte-8f2fnu");
    			add_location(table, file$2, 6, 4, 109);
    			attr_dev(div, "class", "table-wrapper svelte-8f2fnu");
    			add_location(div, file$2, 5, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr0, null);
    			}

    			append_dev(table, t0);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, p0);
    			append_dev(td0, t2);
    			append_dev(td0, p1);
    			append_dev(td0, t4);
    			append_dev(td0, p2);
    			append_dev(tr1, t6);
    			append_dev(tr1, td1);
    			append_dev(tr1, t8);
    			append_dev(tr1, td2);
    			append_dev(td2, p3);
    			append_dev(td2, t10);
    			append_dev(td2, p4);
    			append_dev(tr1, t12);
    			append_dev(tr1, td3);
    			append_dev(td3, p5);
    			append_dev(tr1, t14);
    			append_dev(tr1, td4);
    			mount_component(button0, td4, null);
    			append_dev(tbody, t15);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td5);
    			append_dev(td5, p6);
    			append_dev(td5, t17);
    			append_dev(td5, p7);
    			append_dev(td5, t19);
    			append_dev(td5, p8);
    			append_dev(tr2, t21);
    			append_dev(tr2, td6);
    			append_dev(tr2, t23);
    			append_dev(tr2, td7);
    			append_dev(td7, p9);
    			append_dev(td7, t25);
    			append_dev(td7, p10);
    			append_dev(tr2, t27);
    			append_dev(tr2, td8);
    			append_dev(td8, p11);
    			append_dev(tr2, t29);
    			append_dev(tr2, td9);
    			mount_component(button1, td9, null);
    			append_dev(tbody, t30);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td10);
    			append_dev(td10, p12);
    			append_dev(td10, t32);
    			append_dev(td10, p13);
    			append_dev(td10, t34);
    			append_dev(td10, p14);
    			append_dev(tr3, t36);
    			append_dev(tr3, td11);
    			append_dev(tr3, t38);
    			append_dev(tr3, td12);
    			append_dev(td12, p15);
    			append_dev(td12, t40);
    			append_dev(td12, p16);
    			append_dev(tr3, t42);
    			append_dev(tr3, td13);
    			append_dev(td13, p17);
    			append_dev(tr3, t44);
    			append_dev(tr3, td14);
    			mount_component(button2, td14, null);
    			append_dev(tbody, t45);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td15);
    			append_dev(td15, p18);
    			append_dev(td15, t47);
    			append_dev(td15, p19);
    			append_dev(td15, t49);
    			append_dev(td15, p20);
    			append_dev(tr4, t51);
    			append_dev(tr4, td16);
    			append_dev(tr4, t53);
    			append_dev(tr4, td17);
    			append_dev(td17, p21);
    			append_dev(td17, t55);
    			append_dev(td17, p22);
    			append_dev(tr4, t57);
    			append_dev(tr4, td18);
    			append_dev(td18, p23);
    			append_dev(tr4, t59);
    			append_dev(tr4, td19);
    			mount_component(button3, td19, null);
    			append_dev(tbody, t60);
    			append_dev(tbody, tr5);
    			append_dev(tr5, td20);
    			append_dev(td20, p24);
    			append_dev(td20, t62);
    			append_dev(td20, p25);
    			append_dev(td20, t64);
    			append_dev(td20, p26);
    			append_dev(tr5, t66);
    			append_dev(tr5, td21);
    			append_dev(tr5, t68);
    			append_dev(tr5, td22);
    			append_dev(td22, p27);
    			append_dev(td22, t70);
    			append_dev(td22, p28);
    			append_dev(tr5, t72);
    			append_dev(tr5, td23);
    			append_dev(td23, p29);
    			append_dev(tr5, t74);
    			append_dev(tr5, td24);
    			mount_component(button4, td24, null);
    			append_dev(tbody, t75);
    			append_dev(tbody, tr6);
    			append_dev(tr6, td25);
    			append_dev(td25, p30);
    			append_dev(td25, t77);
    			append_dev(td25, p31);
    			append_dev(td25, t79);
    			append_dev(td25, p32);
    			append_dev(tr6, t81);
    			append_dev(tr6, td26);
    			append_dev(tr6, t83);
    			append_dev(tr6, td27);
    			append_dev(td27, p33);
    			append_dev(td27, t85);
    			append_dev(td27, p34);
    			append_dev(tr6, t87);
    			append_dev(tr6, td28);
    			append_dev(td28, p35);
    			append_dev(tr6, t89);
    			append_dev(tr6, td29);
    			mount_component(button5, td29, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*thItems*/ 1) {
    				each_value = /*thItems*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(button3);
    			destroy_component(button4);
    			destroy_component(button5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	let { thItems } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (thItems === undefined && !('thItems' in $$props || $$self.$$.bound[$$self.$$.props['thItems']])) {
    			console.warn("<Table> was created without expected prop 'thItems'");
    		}
    	});

    	const writable_props = ['thItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('thItems' in $$props) $$invalidate(0, thItems = $$props.thItems);
    	};

    	$$self.$capture_state = () => ({ thItems, Button });

    	$$self.$inject_state = $$props => {
    		if ('thItems' in $$props) $$invalidate(0, thItems = $$props.thItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [thItems];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { thItems: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get thItems() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thItems(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ui/CheckBox.svelte generated by Svelte v3.55.1 */

    const file$1 = "src/ui/CheckBox.svelte";

    // (17:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let label;
    	let input;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(/*value*/ ctx[1]);
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*value*/ ctx[1];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-1rsnngk");
    			add_location(input, file$1, 19, 8, 445);
    			attr_dev(label, "class", "svelte-1rsnngk");
    			add_location(label, file$1, 18, 4, 429);
    			attr_dev(div, "class", "checkbox-wrapper svelte-1rsnngk");
    			add_location(div, file$1, 17, 0, 394);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, input);
    			input.checked = /*checked*/ ctx[0];
    			append_dev(label, t0);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 2) {
    				prop_dev(input, "__value", /*value*/ ctx[1]);
    				input.value = input.__value;
    			}

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty & /*value*/ 2) set_data_dev(t1, /*value*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(17:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if customCheckBox}
    function create_if_block(ctx) {
    	let div;
    	let label;
    	let input;
    	let t0;
    	let span1;
    	let t1;
    	let t2;
    	let span0;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*value*/ ctx[1]);
    			t2 = space();
    			span0 = element("span");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "feature");
    			input.value = "1";
    			attr_dev(input, "class", "svelte-1rsnngk");
    			add_location(input, file$1, 10, 8, 201);
    			attr_dev(span0, "class", "Icon Icon--checkLight svelte-1rsnngk");
    			add_location(span0, file$1, 12, 8, 304);
    			attr_dev(span1, "class", "pill-list-label svelte-1rsnngk");
    			add_location(span1, file$1, 11, 8, 258);
    			attr_dev(label, "class", "pill-list-item svelte-1rsnngk");
    			add_location(label, file$1, 9, 4, 162);
    			attr_dev(div, "class", "pill-checkbox-wrapper svelte-1rsnngk");
    			add_location(div, file$1, 8, 0, 122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, span1);
    			append_dev(span1, t1);
    			append_dev(span1, t2);
    			append_dev(span1, span0);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 2) set_data_dev(t1, /*value*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:0) {#if customCheckBox}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*customCheckBox*/ ctx[2]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckBox', slots, []);
    	let { value } = $$props;
    	let { checked = false } = $$props;
    	let { customCheckBox = false } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<CheckBox> was created without expected prop 'value'");
    		}
    	});

    	const writable_props = ['value', 'checked', 'customCheckBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckBox> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('customCheckBox' in $$props) $$invalidate(2, customCheckBox = $$props.customCheckBox);
    	};

    	$$self.$capture_state = () => ({ value, checked, customCheckBox });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
    		if ('customCheckBox' in $$props) $$invalidate(2, customCheckBox = $$props.customCheckBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [checked, value, customCheckBox, input_change_handler];
    }

    class CheckBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 1, checked: 0, customCheckBox: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckBox",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get value() {
    		throw new Error("<CheckBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<CheckBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<CheckBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<CheckBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customCheckBox() {
    		throw new Error("<CheckBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customCheckBox(value) {
    		throw new Error("<CheckBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/SearchResults.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file = "src/SearchResults.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[12] = list;
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[14] = list;
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[15] = list;
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (48:20) {#each departureReturn as option, index }
    function create_each_block_2(ctx) {
    	let checkbox;
    	let updating_checked;
    	let current;

    	function checkbox_checked_binding(value) {
    		/*checkbox_checked_binding*/ ctx[6](value, /*index*/ ctx[13]);
    	}

    	let checkbox_props = {
    		customCheckBox: true,
    		value: /*option*/ ctx[11].value
    	};

    	if (/*selectedDepartureOptions*/ ctx[1][/*index*/ ctx[13]] !== void 0) {
    		checkbox_props.checked = /*selectedDepartureOptions*/ ctx[1][/*index*/ ctx[13]];
    	}

    	checkbox = new CheckBox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding));

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkbox_changes = {};

    			if (!updating_checked && dirty & /*selectedDepartureOptions*/ 2) {
    				updating_checked = true;
    				checkbox_changes.checked = /*selectedDepartureOptions*/ ctx[1][/*index*/ ctx[13]];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(48:20) {#each departureReturn as option, index }",
    		ctx
    	});

    	return block;
    }

    // (62:20) {#each departureReturn as option, index }
    function create_each_block_1(ctx) {
    	let checkbox;
    	let updating_checked;
    	let current;

    	function checkbox_checked_binding_1(value) {
    		/*checkbox_checked_binding_1*/ ctx[7](value, /*index*/ ctx[13]);
    	}

    	let checkbox_props = {
    		customCheckBox: true,
    		value: /*option*/ ctx[11].value
    	};

    	if (/*selectedDepartureOptions*/ ctx[1][/*index*/ ctx[13]] !== void 0) {
    		checkbox_props.checked = /*selectedDepartureOptions*/ ctx[1][/*index*/ ctx[13]];
    	}

    	checkbox = new CheckBox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding_1));

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkbox_changes = {};

    			if (!updating_checked && dirty & /*selectedDepartureOptions*/ 2) {
    				updating_checked = true;
    				checkbox_changes.checked = /*selectedDepartureOptions*/ ctx[1][/*index*/ ctx[13]];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(62:20) {#each departureReturn as option, index }",
    		ctx
    	});

    	return block;
    }

    // (80:20) {#each airlinesOptions as option, index}
    function create_each_block(ctx) {
    	let checkbox;
    	let updating_checked;
    	let current;

    	function checkbox_checked_binding_2(value) {
    		/*checkbox_checked_binding_2*/ ctx[8](value, /*index*/ ctx[13]);
    	}

    	let checkbox_props = { value: /*option*/ ctx[11].value };

    	if (/*selectedAirlinesOptions*/ ctx[0][/*index*/ ctx[13]] !== void 0) {
    		checkbox_props.checked = /*selectedAirlinesOptions*/ ctx[0][/*index*/ ctx[13]];
    	}

    	checkbox = new CheckBox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, 'checked', checkbox_checked_binding_2));

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkbox_changes = {};

    			if (!updating_checked && dirty & /*selectedAirlinesOptions*/ 1) {
    				updating_checked = true;
    				checkbox_changes.checked = /*selectedAirlinesOptions*/ ctx[0][/*index*/ ctx[13]];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(80:20) {#each airlinesOptions as option, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div18;
    	let header;
    	let h5;
    	let icon0;
    	let t0;
    	let span;
    	let t2;
    	let div0;
    	let ticketbooking;
    	let t3;
    	let div17;
    	let div15;
    	let div3;
    	let div1;
    	let h40;
    	let t5;
    	let div2;
    	let t6;
    	let div6;
    	let div4;
    	let h41;
    	let t8;
    	let div5;
    	let t9;
    	let div8;
    	let div7;
    	let h42;
    	let t11;
    	let div11;
    	let div9;
    	let h43;
    	let t13;
    	let div10;
    	let t14;
    	let div14;
    	let button;
    	let icon1;
    	let t15;
    	let div12;
    	let p0;
    	let t17;
    	let div13;
    	let p1;
    	let t19;
    	let div16;
    	let table;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon$1({
    			props: { scale: "2", data: ticket },
    			$$inline: true
    		});

    	ticketbooking = new TicketBooking({
    			props: {
    				changeFormLayout: true,
    				btnText: "Update Search"
    			},
    			$$inline: true
    		});

    	let each_value_2 = /*departureReturn*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*departureReturn*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*airlinesOptions*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_2 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	icon1 = new Icon$1({ props: { data: close }, $$inline: true });

    	table = new Table({
    			props: { thItems: /*tableHeadColumns*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			header = element("header");
    			h5 = element("h5");
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			span = element("span");
    			span.textContent = "Udaan";
    			t2 = space();
    			div0 = element("div");
    			create_component(ticketbooking.$$.fragment);
    			t3 = space();
    			div17 = element("div");
    			div15 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Departure";
    			t5 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t6 = space();
    			div6 = element("div");
    			div4 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Return";
    			t8 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t9 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Price";
    			t11 = space();
    			div11 = element("div");
    			div9 = element("div");
    			h43 = element("h4");
    			h43.textContent = "Preferred Airlines";
    			t13 = space();
    			div10 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			div14 = element("div");
    			button = element("button");
    			create_component(icon1.$$.fragment);
    			t15 = space();
    			div12 = element("div");
    			p0 = element("p");
    			p0.textContent = `${APP_CONSTANTS.OFFER_DATA.TITLE}`;
    			t17 = space();
    			div13 = element("div");
    			p1 = element("p");
    			p1.textContent = `${APP_CONSTANTS.OFFER_DATA.BODY}`;
    			t19 = space();
    			div16 = element("div");
    			create_component(table.$$.fragment);
    			attr_dev(span, "class", "ml-2 svelte-1p2cdh3");
    			add_location(span, file, 35, 13, 1246);
    			attr_dev(h5, "class", "logo-text d-flex svelte-1p2cdh3");
    			add_location(h5, file, 34, 8, 1171);
    			attr_dev(header, "class", "svelte-1p2cdh3");
    			add_location(header, file, 33, 4, 1154);
    			attr_dev(div0, "class", "light-bg ticket-booking-wrapper svelte-1p2cdh3");
    			add_location(div0, file, 37, 4, 1302);
    			attr_dev(h40, "class", "svelte-1p2cdh3");
    			add_location(h40, file, 44, 20, 1639);
    			attr_dev(div1, "class", "filter-heading");
    			add_location(div1, file, 43, 16, 1590);
    			attr_dev(div2, "class", "filter-details grid-2-col w-80 svelte-1p2cdh3");
    			add_location(div2, file, 46, 16, 1697);
    			attr_dev(div3, "class", "filter-section");
    			add_location(div3, file, 42, 12, 1545);
    			attr_dev(h41, "class", "svelte-1p2cdh3");
    			add_location(h41, file, 58, 20, 2204);
    			attr_dev(div4, "class", "filter-heading");
    			add_location(div4, file, 57, 16, 2155);
    			attr_dev(div5, "class", "filter-details grid-2-col w-80 svelte-1p2cdh3");
    			add_location(div5, file, 60, 16, 2259);
    			attr_dev(div6, "class", "filter-section");
    			add_location(div6, file, 56, 12, 2110);
    			attr_dev(h42, "class", "svelte-1p2cdh3");
    			add_location(h42, file, 71, 20, 2746);
    			attr_dev(div7, "class", "filter-heading");
    			add_location(div7, file, 70, 16, 2697);
    			attr_dev(div8, "class", "filter-section");
    			add_location(div8, file, 69, 12, 2652);
    			attr_dev(h43, "class", "svelte-1p2cdh3");
    			add_location(h43, file, 76, 20, 2909);
    			attr_dev(div9, "class", "filter-heading");
    			add_location(div9, file, 75, 16, 2860);
    			attr_dev(div10, "class", "filter-details");
    			add_location(div10, file, 78, 16, 2976);
    			attr_dev(div11, "class", "filter-section");
    			add_location(div11, file, 74, 12, 2815);
    			attr_dev(button, "class", "hide-popup-btn svelte-1p2cdh3");
    			add_location(button, file, 85, 16, 3335);
    			attr_dev(p0, "class", "svelte-1p2cdh3");
    			add_location(p0, file, 87, 20, 3499);
    			attr_dev(div12, "class", "popup-heading");
    			add_location(div12, file, 86, 16, 3451);
    			attr_dev(p1, "class", "svelte-1p2cdh3");
    			add_location(p1, file, 90, 20, 3630);
    			attr_dev(div13, "class", "popup-description");
    			add_location(div13, file, 89, 16, 3578);
    			attr_dev(div14, "class", "offer-wrapper fadeOut svelte-1p2cdh3");
    			toggle_class(div14, "remove-popup", /*hideOfferPopup*/ ctx[2]);
    			add_location(div14, file, 84, 12, 3247);
    			attr_dev(div15, "class", "filter-section-wrapper d-flex flex-column svelte-1p2cdh3");
    			add_location(div15, file, 41, 8, 1477);
    			attr_dev(div16, "class", "flight-results-wrapper svelte-1p2cdh3");
    			add_location(div16, file, 94, 8, 3734);
    			attr_dev(div17, "class", "results-container svelte-1p2cdh3");
    			add_location(div17, file, 40, 4, 1437);
    			attr_dev(div18, "class", "search-results-wrapper svelte-1p2cdh3");
    			add_location(div18, file, 32, 0, 1113);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, header);
    			append_dev(header, h5);
    			mount_component(icon0, h5, null);
    			append_dev(h5, t0);
    			append_dev(h5, span);
    			append_dev(div18, t2);
    			append_dev(div18, div0);
    			mount_component(ticketbooking, div0, null);
    			append_dev(div18, t3);
    			append_dev(div18, div17);
    			append_dev(div17, div15);
    			append_dev(div15, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h40);
    			append_dev(div3, t5);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div2, null);
    			}

    			append_dev(div15, t6);
    			append_dev(div15, div6);
    			append_dev(div6, div4);
    			append_dev(div4, h41);
    			append_dev(div6, t8);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div15, t9);
    			append_dev(div15, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h42);
    			append_dev(div15, t11);
    			append_dev(div15, div11);
    			append_dev(div11, div9);
    			append_dev(div9, h43);
    			append_dev(div11, t13);
    			append_dev(div11, div10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div10, null);
    			}

    			append_dev(div15, t14);
    			append_dev(div15, div14);
    			append_dev(div14, button);
    			mount_component(icon1, button, null);
    			append_dev(div14, t15);
    			append_dev(div14, div12);
    			append_dev(div12, p0);
    			append_dev(div14, t17);
    			append_dev(div14, div13);
    			append_dev(div13, p1);
    			append_dev(div17, t19);
    			append_dev(div17, div16);
    			mount_component(table, div16, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*departureReturn, selectedDepartureOptions*/ 18) {
    				each_value_2 = /*departureReturn*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*departureReturn, selectedDepartureOptions*/ 18) {
    				each_value_1 = /*departureReturn*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div5, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*airlinesOptions, selectedAirlinesOptions*/ 33) {
    				each_value = /*airlinesOptions*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div10, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*hideOfferPopup*/ 4) {
    				toggle_class(div14, "remove-popup", /*hideOfferPopup*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(ticketbooking.$$.fragment, local);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icon1.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(ticketbooking.$$.fragment, local);
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icon1.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			destroy_component(icon0);
    			destroy_component(ticketbooking);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon1);
    			destroy_component(table);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchResults', slots, []);
    	let tableHeadColumns = APP_CONSTANTS.TABLE.TABLE_HEAD_COLUMNS;
    	let departureReturn = APP_CONSTANTS.FILTER_SECTION.RETURN_DEPARTURE_OPTIONS;
    	let airlinesOptions = APP_CONSTANTS.FILTER_SECTION.AIRLINES_OPTIONS;
    	let selectedAirlinesOptions = airlinesOptions.map(() => false);
    	let selectedDepartureOptions = departureReturn.map(() => false);
    	let hideOfferPopup = false;

    	function test() {
    		airlinesOptions.filter((o, i) => {
    			console.log(o);
    			return selectedAirlinesOptions[i];
    		});

    		selectedDepartureOptions.filter((o, i) => {
    			console.log(o);
    			return selectedDepartureOptions[i];
    		});
    	}

    	test();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SearchResults> was created with unknown prop '${key}'`);
    	});

    	function checkbox_checked_binding(value, index) {
    		if ($$self.$$.not_equal(selectedDepartureOptions[index], value)) {
    			selectedDepartureOptions[index] = value;
    			$$invalidate(1, selectedDepartureOptions);
    		}
    	}

    	function checkbox_checked_binding_1(value, index) {
    		if ($$self.$$.not_equal(selectedDepartureOptions[index], value)) {
    			selectedDepartureOptions[index] = value;
    			$$invalidate(1, selectedDepartureOptions);
    		}
    	}

    	function checkbox_checked_binding_2(value, index) {
    		if ($$self.$$.not_equal(selectedAirlinesOptions[index], value)) {
    			selectedAirlinesOptions[index] = value;
    			$$invalidate(0, selectedAirlinesOptions);
    		}
    	}

    	const click_handler = () => $$invalidate(2, hideOfferPopup = true);

    	$$self.$capture_state = () => ({
    		APP_CONSTANTS,
    		TicketBooking,
    		Icon: Icon$1,
    		ticket,
    		close,
    		Table,
    		CheckBox,
    		tableHeadColumns,
    		departureReturn,
    		airlinesOptions,
    		selectedAirlinesOptions,
    		selectedDepartureOptions,
    		hideOfferPopup,
    		test
    	});

    	$$self.$inject_state = $$props => {
    		if ('tableHeadColumns' in $$props) $$invalidate(3, tableHeadColumns = $$props.tableHeadColumns);
    		if ('departureReturn' in $$props) $$invalidate(4, departureReturn = $$props.departureReturn);
    		if ('airlinesOptions' in $$props) $$invalidate(5, airlinesOptions = $$props.airlinesOptions);
    		if ('selectedAirlinesOptions' in $$props) $$invalidate(0, selectedAirlinesOptions = $$props.selectedAirlinesOptions);
    		if ('selectedDepartureOptions' in $$props) $$invalidate(1, selectedDepartureOptions = $$props.selectedDepartureOptions);
    		if ('hideOfferPopup' in $$props) $$invalidate(2, hideOfferPopup = $$props.hideOfferPopup);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedAirlinesOptions*/ 1) {
    			console.log(selectedAirlinesOptions);
    		}
    	};

    	return [
    		selectedAirlinesOptions,
    		selectedDepartureOptions,
    		hideOfferPopup,
    		tableHeadColumns,
    		departureReturn,
    		airlinesOptions,
    		checkbox_checked_binding,
    		checkbox_checked_binding_1,
    		checkbox_checked_binding_2,
    		click_handler
    	];
    }

    class SearchResults extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchResults",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Home.svelte generated by Svelte v3.55.1 */

    function create_fragment$1(ctx) {
    	let searchresults;
    	let current;
    	searchresults = new SearchResults({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(searchresults.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchresults, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchresults.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchresults.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchresults, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Icon: Icon$1,
    		ticket,
    		SearchResults,
    		TicketBooking
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.1 */

    function create_fragment(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Home });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		// name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
