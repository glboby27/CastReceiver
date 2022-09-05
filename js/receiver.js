/*
Copyright 2020 Google LLC. All Rights Reserved.

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

/**
 * This sample demonstrates how to build your own Receiver for use with Google
 * Cast.
 */

'use strict';

import { CastQueue } from './queuing.js';
import { AdsTracker, SenderTracker, ContentTracker } from './cast_analytics.js';

/**
 * Constants to be used for fetching media by entity from sample repository.
 */
const ID_REGEX = '\/?([^\/]+)\/?$';
const CONTENT_URL = 
  'https://storage.googleapis.com/cpe-sample-media/content.json';

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();


const LOG_RECEIVER_TAG = 'Receiver';

/**
 * Debug Logger
 */
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();



/**
 * WARNING: Make sure to turn off debug logger for production release as it
 * may expose details of your app.
 * Uncomment below line to enable debug logger, show a 'DEBUG MODE' tag at
 * top left corner and show debug overlay.
 */
context.addEventListener(cast.framework.system.EventType.READY, () => {
    if (!castDebugLogger.debugOverlayElement_) {
     /**
      *  Enable debug logger and show a 'DEBUG MODE' tag at
      *  top left corner.
      */
        castDebugLogger.setEnabled(true);

     /**
      * Show debug overlay.
      */
        castDebugLogger.showDebugLogs(false);
    }
});

/**
 * Set verbosity level for Core events.
 */
castDebugLogger.loggerLevelByEvents = {
  'cast.framework.events.category.CORE':
    cast.framework.LoggerLevel.INFO,
  'cast.framework.events.EventType.MEDIA_STATUS':
    cast.framework.LoggerLevel.DEBUG
};

if (!castDebugLogger.loggerLevelByTags) {
  castDebugLogger.loggerLevelByTags = {};
}

/**
 * Set verbosity level for custom tag.
 * Enables log messages for error, warn, info and debug.
 */
castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] =
  cast.framework.LoggerLevel.DEBUG;

/**
 * Example of how to listen for events on playerManager.
 */
playerManager.addEventListener(
  cast.framework.events.EventType.ERROR, (event) => {
    castDebugLogger.error(LOG_RECEIVER_TAG,
      'Detailed Error Code - ' + event.detailedErrorCode);
    if (event && event.detailedErrorCode == 905) {
      castDebugLogger.error(LOG_RECEIVER_TAG,
        'LOAD_FAILED: Verify the load request is set up ' +
        'properly and the media is able to play.');
    }
    // cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, () => {
    //   const audioTracksManager = playerManager.getAudioTracksManager();
  
    //   // Get all audio tracks
    //   const tracks = audioTracksManager.getTracks();
  
    //   // Choose the first audio track to be active by specifying its ID
    //   audioTracksManager.setActiveById(tracks[0].trackId);

    //   castDebugLogger.info(LOG_RECEIVER_TAG,'');
    // }
});

/**
 * check supported codec
 */
castDebugLogger.debug(LOG_RECEIVER_TAG , 'audio/mp4_mp4a.40.5 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5'));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'audio/mp4_mp4a.40.2 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2'));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'audio/mp4_mp4a.40.5 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 2));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'audio/mp4_mp4a.40.2 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 2));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'audio/mp4_mp4a.40.5 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 6));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'audio/mp4_mp4a.40.2 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 6));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'video/mp4_avc1.4d4028 : ' + context.canDisplayType('video/mp4', 'avc1.4d4028'));
castDebugLogger.debug(LOG_RECEIVER_TAG , 'video/mp4_avc1.64001e : ' + context.canDisplayType('video/mp4', 'avc1.64001e'));


/**
 * Example analytics tracking implementation. See cast_analytics.js. Must
 * complete TODO item in google_analytics.js.
 */
const adTracker = new AdsTracker();
const senderTracker = new SenderTracker();
const contentTracker = new ContentTracker();
// adTracker.startTracking();
// senderTracker.startTracking();
// contentTracker.startTracking();

/**
 * Adds an ad to the beginning of the desired content.
 * @param {cast.framework.messages.MediaInformation} mediaInformation The target
 * mediainformation. Usually obtained through a load interceptor.
 */
function addBreaks(mediaInformation) {
  castDebugLogger.debug(LOG_RECEIVER_TAG, "addBreaks: " +
    JSON.stringify(mediaInformation));
  return fetchMediaById('fbb_ad')
  .then((clip1) => {
    mediaInformation.breakClips = [
      {
        id: 'fbb_ad',
        title: clip1.title,
        contentUrl: clip1.stream.dash,
        contentType: 'application/dash+xml',
        whenSkippable: 1
      }
    ];

    mediaInformation.breaks = [
      {
        id: 'pre-roll',
        breakClipIds: ['fbb_ad'],
        position: 0
      }
    ];
  });
}

/**
 * Obtains media from a remote repository.
 * @param  {Number} Entity or ID that contains a key to media in JSON hosted
 * by CONTENT_URL.
 * @return {Promise} Contains the media information of the desired entity.
 */
function fetchMediaById(id) {
  castDebugLogger.debug(LOG_RECEIVER_TAG, "fetching id: " + id);

  return new Promise((accept, reject) => {
    fetch(CONTENT_URL)
    .then((response) => response.json())
    .then((obj) => {
      if (obj) {
        if (obj[id]) {
          accept(obj[id]);
        }
        else {
          reject(`${id} not found in repository`);
        }
      }
      else {
        reject('Content repository not found.');
      }
    });
  });
}


/**
 * Intercept the LOAD request to load and set the contentUrl and add ads.
 */
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD, loadRequestData => {
    castDebugLogger.debug(LOG_RECEIVER_TAG,
      `loadRequestData: ${JSON.stringify(loadRequestData)}`);
    
    // If the loadRequestData is incomplete return an error message
    if (!loadRequestData || !loadRequestData.media) {
      const error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED);
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      return error;
    }

    // check all content source fields for asset URL or ID
    let source = loadRequestData.media.contentUrl
      || loadRequestData.media.entity || loadRequestData.media.contentId;

    // If there is no source or a malformed ID then return an error.
    if (!source || source == "" || !source.match(ID_REGEX)) {
      let error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED);
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      return error;
    }

    let sourceId = source.match(ID_REGEX)[1];

    // Add breaks to the media information and set the contentUrl
    return addBreaks(loadRequestData.media)
    .then(() => {
      // If the source is a url that points to an asset don't fetch from backend
      if (sourceId.includes('.')) {
        castDebugLogger.debug(LOG_RECEIVER_TAG,
          "Interceptor received full URL");
        loadRequestData.media.contentUrl = source;
        return loadRequestData;
      }

      // Fetch the contentUrl if provided an ID or entity URL
      else {
        castDebugLogger.debug(LOG_RECEIVER_TAG, "Interceptor received ID");
        return fetchMediaById(sourceId)
        .then((item) => {
          let metadata = new cast.framework.messages.GenericMediaMetadata();
          metadata.title = item.title;
          metadata.subtitle = item.description;
          // mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
          // mediaInfo.metadata.title = station.station_name;
          // mediaInfo.metadata.subtitle = "Icerrr Chromecast";
          // mediaInfo.metadata.images = [{'url': station.station_icon}];
          metadata.images = [{'url' : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/ToTheFuture2-480x270.jpg'}
        , {'url' : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/780x1200/ToTheFuture-789x1200.jpg'}];
          castDebugLogger.debug(LOG_RECEIVER_TAG, "item.title : " + item.title);
          castDebugLogger.debug(LOG_RECEIVER_TAG, "item.description : " + item.description);
          
          loadRequestData.media.contentId = item.stream.dash;
          loadRequestData.media.contentType = 'application/dash+xml';
          loadRequestData.media.metadata = metadata;
          return loadRequestData;
        })
      }
    })
    .catch((errorMessage) => {
      let error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED);
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      castDebugLogger.error(LOG_RECEIVER_TAG, errorMessage);
      return error;
    });
  }
);

const playbackConfig = new cast.framework.PlaybackConfig();

/**
 * Set the player to start playback as soon as there are five seconds of
 * media content buffered. Default is 10.
 */
playbackConfig.autoResumeDuration = 5;
castDebugLogger.info(LOG_RECEIVER_TAG,
  `autoResumeDuration set to: ${playbackConfig.autoResumeDuration}`);

/**
 * Set the control buttons in the UI controls.
 */
const controls = cast.framework.ui.Controls.getInstance();
controls.clearDefaultSlotAssignments();

/**
 * Assign buttons to control slots.
 */
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
  cast.framework.ui.ControlsButton.QUEUE_PREV
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
  cast.framework.ui.ControlsButton.CAPTIONS
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
  cast.framework.ui.ControlsButton.SEEK_FORWARD_15
);
controls.assignButton(
  cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2,
  cast.framework.ui.ControlsButton.QUEUE_NEXT
);

const LOG_MODEL_CHECK_TAG = 'Model_Check';
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.5 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5'));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.2 : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2'));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.5 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 2));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.2 - 2channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 2));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.5 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.5', 6));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'audio/mp4_mp4a.40.2 - 5.1channel : ' + context.canDisplayType('audio/mp4', 'mp4a.40.2', 6));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'video/mp4_avc1.4d4028 : ' + context.canDisplayType('video/mp4', 'avc1.4d4028'));
castDebugLogger.info(LOG_MODEL_CHECK_TAG , 'video/mp4_avc1.64001e : ' + context.canDisplayType('video/mp4', 'avc1.64001e'));

context.start({
  queue: new CastQueue(),
  playbackConfig: playbackConfig,
  supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA |
                      cast.framework.messages.Command.QUEUE_PREV |
                      cast.framework.messages.Command.QUEUE_NEXT |
                      cast.framework.messages.Command.STREAM_TRANSFER
});
