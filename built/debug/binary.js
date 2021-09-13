// total=4765 new=47.60% cached=0.00% other=52.40%
(function (ectx) {
'use strict';
const runtime = ectx.runtime;
const oops = ectx.oops;
const doNothing = ectx.doNothing;
const pxsim = ectx.pxsim;
const globals = ectx.globals;
const maybeYield = ectx.maybeYield;
const setupDebugger = ectx.setupDebugger;
const isBreakFrame = ectx.isBreakFrame;
const breakpoint = ectx.breakpoint;
const trace = ectx.trace;
const checkStack = ectx.checkStack;
const leave = ectx.leave;
const checkResumeConsumed = ectx.checkResumeConsumed;
const setupResume = ectx.setupResume;
const setupLambda = ectx.setupLambda;
const checkSubtype = ectx.checkSubtype;
const failedCast = ectx.failedCast;
const buildResume = ectx.buildResume;
const mkVTable = ectx.mkVTable;
const bind = ectx.bind;
const leaveAccessor = ectx.leaveAccessor;
const __this = runtime;
const pxtrt = pxsim.pxtrt;
let yieldSteps = 1;
ectx.setupYield(function() { yieldSteps = 100; })
pxsim.setTitle("pxt-SGBotic-myIoT-MQTT2");
pxsim.setConfigData({}, {});
pxtrt.mapKeyNames = [
 "",
 "mqtt_busy",
 "sending_data"
];
__this.setupPerfCounters([]);
const pxsim_Array__getAt = pxsim.Array_.getAt;
const pxsim_Array__length = pxsim.Array_.length;
const pxsim_Array__mk = pxsim.Array_.mk;
const pxsim_Array__push = pxsim.Array_.push;
const pxsim_Boolean__bang = pxsim.Boolean_.bang;
const pxsim_String__concat = pxsim.String_.concat;
const pxsim_String__stringConv = pxsim.String_.stringConv;
const pxsim_numops_toBool = pxsim.numops.toBool;
const pxsim_numops_toBoolDecr = pxsim.numops.toBoolDecr;
const pxsim_pxtcore_mkAction = pxsim.pxtcore.mkAction;
const pxsim_pxtcore_mkClassInstance = pxsim.pxtcore.mkClassInstance;
const pxsim_pxtrt_ldlocRef = pxsim.pxtrt.ldlocRef;
const pxsim_pxtrt_mapGetByString = pxsim.pxtrt.mapGetByString;
const pxsim_pxtrt_stclo = pxsim.pxtrt.stclo;
const pxsim_pxtrt_stlocRef = pxsim.pxtrt.stlocRef;
const pxsim_Boolean_ = pxsim.Boolean_;
const pxsim_pxtcore = pxsim.pxtcore;
const pxsim_String_ = pxsim.String_;
const pxsim_ImageMethods = pxsim.ImageMethods;
const pxsim_Array_ = pxsim.Array_;
const pxsim_pxtrt = pxsim.pxtrt;
const pxsim_numops = pxsim.numops;


function _main___P4498692(s) {
let r0 = s.r0, step = s.pc;
s.pc = -1;


while (true) {
if (yieldSteps-- < 0 && maybeYield(s, step, r0) || runtime !== pxsim.runtime) return null;
switch (step) {
  case 0:

    globals._intervals___4499078 = (undefined);
    globals._pollEventQueue___4499294 = (undefined);
    r0 = pxsim_pxtcore_mkClassInstance(SGBotic_wifi_serial_class__C4499462_VT);
    s.tmp_0 = r0;
    s.tmp_1 = SGBotic_wifi_serial_class_constructor__P4499463_mk(s);
    s.tmp_1.arg0 = s.tmp_0;
    s.callLocIdx = 0; s.pc = 1; return s.tmp_1;
  case 1:
    r0 = s.retval;
    globals.wifi_serial_obj___4499478 = (s.tmp_0);
    r0 = undefined;
    return leave(s, r0)
  default: oops()
} } }
_main___P4498692.info = {"start":0,"length":0,"line":0,"column":0,"endLine":0,"endColumn":0,"fileName":"base.ts","functionName":"<main>","argumentNames":[]}
_main___P4498692.continuations = [  ]

function _main___P4498692_mk(s) {
    checkStack(s.depth);
    return {
        parent: s, fn: _main___P4498692, depth: s.depth + 1,
        pc: 0, retval: undefined, r0: undefined, overwrittenPC: false, lambdaArgs: null,
  tmp_0: undefined,
  tmp_1: undefined,
} }





function SGBotic_wifi_serial_class_constructor__P4499463(s) {
let r0 = s.r0, step = s.pc;
s.pc = -1;


while (true) {
if (yieldSteps-- < 0 && maybeYield(s, step, r0) || runtime !== pxsim.runtime) return null;
switch (step) {
  case 0:

    if (s.lambdaArgs) {
      s.arg0 = (s.lambdaArgs[0]);
      s.lambdaArgs = null;
    }
    r0 = s.arg0;
    if (!checkSubtype(r0, SGBotic_wifi_serial_class__C4499462_VT)) failedCast(r0);
    r0 = (s.arg0).fields["sending_data"] = (false);
    r0 = (s.arg0).fields["mqtt_busy"] = (false);
    r0 = undefined;
    return leave(s, r0)
  default: oops()
} } }
SGBotic_wifi_serial_class_constructor__P4499463.info = {"start":150,"length":98,"line":9,"column":8,"endLine":12,"endColumn":9,"fileName":"myIoT.ts","functionName":"inline","argumentNames":["this"]}

function SGBotic_wifi_serial_class_constructor__P4499463_mk(s) {
    checkStack(s.depth);
    return {
        parent: s, fn: SGBotic_wifi_serial_class_constructor__P4499463, depth: s.depth + 1,
        pc: 0, retval: undefined, r0: undefined, overwrittenPC: false, lambdaArgs: null,
  arg0: undefined,
} }




const SGBotic_wifi_serial_class__C4499462_VT = mkVTable({
  name: "wifi_serial_class",
  numFields: 2,
  classNo: 16,
  lastSubtypeNo: 16,
  maxBgInstances: null,
  methods: {
  },
  iface: {
    "sending_data": null,
    "set/sending_data": null,
    "mqtt_busy": null,
    "set/mqtt_busy": null,
  },
});

const breakpoints = setupDebugger(1, ["wifi_serial_obj___4499478"])

return _main___P4498692
})
