$(function() {
    var timelineContainer = $('.timeline-container'); 
    var timelineBlocks = $('.timeline-item');
    var offset = 0.8;

    hideBlocks(timelineBlocks, offset);

    timelineContainer.on('scroll', function() {
        (!window.requestAnimationFrame) 
            ? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
            : window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
    });

    function hideBlocks(blocks, offset) {
      blocks.each(function(){
        ($(this).offset().top > timelineContainer.offset().top + timelineContainer.height() * offset) && 
        $(this).find('.timeline-icon, .timeline-content').addClass('is-hidden');
      });
    }
    
    function showBlocks(blocks, offset) {
      blocks.each(function(){
        ($(this).offset().top <= timelineContainer.offset().top + timelineContainer.height() * offset && 
        $(this).find('.timeline-icon').hasClass('is-hidden')) && 
        $(this).find('.timeline-icon, .timeline-content').removeClass('is-hidden').addClass('animate-it');
      });
    }
});
