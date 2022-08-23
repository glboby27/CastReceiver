/*
Copyright 2019 Google LLC. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const LOG_QUEUE_TAG = 'Queue';

/**
 * Debug Logger
 */
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

if (!castDebugLogger.loggerLevelByTags) {
  castDebugLogger.loggerLevelByTags = {};
}
/**
 * Set verbosity level for custom tag.
 * Enable log messages for error, warn and info.
 */
castDebugLogger.loggerLevelByTags[LOG_QUEUE_TAG] =
  cast.framework.LoggerLevel.INFO;

class CastQueue extends cast.framework.QueueBase {
  constructor() {
    super();
  }

  /**
  * Initializes the queue.
  * @param {!cast.framework.messages.LoadRequestData} loadRequestData
  * @return {!cast.framework.messages.QueueData}
  */
  initialize(loadRequestData) {
    if (loadRequestData) {
      let queueData = loadRequestData.queueData;

       /**
       * check supported codec
       */
      const context = cast.framework.CastReceiverContext.getInstance();
      castDebugLogger.info(LOG_QUEUE_TAG , 'audio/mp4_mp4a.40.5 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5'));
      castDebugLogger.info(LOG_QUEUE_TAG , 'audio/mp4_mp4a.40.2 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2'));
      castDebugLogger.info(LOG_QUEUE_TAG , 'audio/mp4_mp4a.40.5 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 2));
      castDebugLogger.info(LOG_QUEUE_TAG , 'audio/mp4_mp4a.40.2 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 2));
      castDebugLogger.info(LOG_QUEUE_TAG , 'audio/mp4_mp4a.40.5 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 6));
      castDebugLogger.info(LOG_QUEUE_TAG , 'audio/mp4_mp4a.40.2 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 6));
      castDebugLogger.info(LOG_QUEUE_TAG , 'video/mp4_avc1.4d4028 : ' + context.canDisplayType('video/mp4', 'avc1.4d4028'));
      castDebugLogger.info(LOG_QUEUE_TAG , 'video/mp4_avc1.64001e : ' + context.canDisplayType('video/mp4', 'avc1.64001e'));
      

      // Create a new queue with media from load request if one doesn't exist.
      if (!queueData || !queueData.items || !queueData.items.length) {
        castDebugLogger.info(LOG_QUEUE_TAG,
          'Creating a new queue with media from the load request');
        queueData = new cast.framework.messages.QueueData();
        let item = new cast.framework.messages.QueueItem();
        item.media = loadRequestData.media;
        queueData.items = [item];
      }
      return queueData;
    }
 }

  /**
  * Picks a set of items after the reference item id and returns as the next
  * items to be inserted into the queue. When referenceItemId is omitted, items
  * are simply appended to the end of the queue.
  * @param {number} referenceItemId
  * @return {!Array<cast.framework.QueueItem>}
  **/
  nextItems(referenceItemId) {
    // Return sample content.
    let item = new cast.framework.messages.QueueItem();
    item.media = new cast.framework.messages.MediaInformation();
    item.media.entity = 'https://sample.com/videos/bbb';
    item.media.customData = { "isSuggested": true };
    return [item];
  }

  /**
  * Picks a set of items before the reference item id and returns as the items
  * to be inserted into the queue. WhenvreferenceItemId is omitted, items are
  * simply appended to beginning of the queue.
  * @param {number} referenceItemId
  * @return {!Array<cast.framework.QueueItem>}
  **/
  prevItems(referenceItemId) {
    // Return sample content.
    let item = new cast.framework.messages.QueueItem();
    item.media = new cast.framework.messages.MediaInformation();
    item.media.entity = 'https://sample.com/videos/ed';
    item.media.customData = { "isSuggested": true };
    return [item];
  }
};

export {
  CastQueue
};
