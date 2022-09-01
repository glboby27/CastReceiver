
const context = cast.framework.CastReceiverContext.getInstance();
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
const LOG_MODEL_CHECK_TAG = 'Model_Check';

/**
 * check supported codec
 */
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.5 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5'));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.2 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2'));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.5 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 2));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.2 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 2));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.5 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 6));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.2 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 6));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'video/mp4_avc1.4d4028 : ' + context.canDisplayType('video/mp4', 'avc1.4d4028'));
 castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'video/mp4_avc1.64001e : ' + context.canDisplayType('video/mp4', 'avc1.64001e'));

 
 
 