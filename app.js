$(document).ready(function() {
  // Elapsed time
  let workTime    = $('#sesTime').text();
  let brkTime     = $('#brkTime').text();

  // Work timer
  let workminT    = Number(workTime);
  let count       = 0;
  let workminET   = 0;
  let worksecET   = 0;
  let worktotalT  = workminT * 60;

  // Break timer
  let brkminT     = Number(brkTime);
  let brkCount    = 0;
  let brkminET    = 0;
  let brksecET    = 0;
  let brktotalT   = brkminT * 60;

  let intervalWork;
  let intervalBrk;

  const counter = {
    workTimer: function() {
      let secLeft = 60 - worksecET;
      let minLeft = workminT - workminET;

      if (secLeft == 60) secLeft = '00';
      if (secLeft < 10 && secLeft !== '00') secLeft = '0' + secLeft;
      if (secLeft == '00') { worksecET = 0; workminET++; }
      if (minLeft < 10) minLeft = '0' + minLeft;

      if (count >= worktotalT) {
        counter.workPause();  counter.workComplete();
      }
      worksecET++; count++;
      status.work();
      setCanvas.drawWork(count, worktotalT);
      $('#min').text(minLeft);  $('#sec').text(secLeft);
      // console.log('Work Time Left: ' + minLeft + ' : ' + secLeft + ' || Time elapsed:' + count);
    },
    workStart: function() {
      intervalWork = setInterval(this.workTimer, 1000);
      status.freeze();
    },
    workPause: function() {
      clearInterval(intervalWork);
      status.unfreeze();
    },
    workComplete: function() {
      clearInterval(intervalWork);
      status.workComplete();
      this.reset();
      this.brkStart();
      status.audio();
    },
    brkTimer: function() {
      let secLeft = 60 - brksecET;
      let minLeft = brkminT - brkminET;

      if (secLeft == 60) secLeft = '00';
      if (secLeft < 10 && secLeft !== '00') secLeft = '0' + secLeft;
      if (secLeft == '00') { brksecET = 0; brkminET++; }
      if (minLeft < 10) minLeft = '0' + minLeft;

      if (brkCount >= brktotalT) {
        counter.brkPause(); counter.brkComplete();
      }
      brksecET++; brkCount++;
      status.break();
      setCanvas.drawBrk(brkCount, brktotalT);
      $('#min').text(minLeft);  $('#sec').text(secLeft);
      // console.log('Break Time Left: ' + minLeft + ' : ' + secLeft + ' || Time elapsed:' + brkCount);
    },
    brkStart: function() {
      status.freeze();
      intervalBrk = setInterval(this.brkTimer, 1000);
    },
    brkPause: function() {
      clearInterval(intervalBrk);
      status.unfreeze();
    },
    brkComplete: function() {
      clearInterval(intervalBrk);
      this.reset();
      // Run workTimer again
      status.sesPause();
      counter.workStart();
      status.audio();
    },
    reset: function() {
      count       = 0;
      workminET   = 0;
      worksecET   = 0;

      brkCount    = 0;
      brkminET    = 0;
      brksecET    = 0;
    },
    updateWorkT: function(time) {
      workminT    = Number(time);
      count       = 0;
      workminET   = 0;
      worksecET   = 0;
      worktotalT  = workminT * 60;
      $('#sesTime').text(time);
    },
    updateBrkT: function(time) {
      brkminT     = Number(time);
      brkCount    = 0;
      brkminET    = 0;
      brksecET    = 0;
      brktotalT   = brkminT * 60;
      $('#brkTime').text(time);
    }
  };


  const status = {
    sesPlay: () => {
      $('#sesPlay').css('display', 'block');  $('#sesPause').css('display', 'none');
      $('#brkPlay').css('display', 'none');   $('#brkPause').css('display', 'none');
    },
    sesPause: () => {
      $('#sesPause').css('display', 'block'); $('#sesPlay').css('display', 'none');
      $('#brkPlay').css('display', 'none');   $('#brkPause').css('display', 'none');
      $('#ses').removeClass('active'); $('#brk').removeClass('active');
    },
    brkPlay: () => {
      $('#brkPlay').css('display', 'block');  $('#brkPause').css('display', 'none');
      $('#sesPlay').css('display', 'none');   $('#sesPause').css('display', 'none');
    },
    brkPause: () => {
      $('#brkPause').css('display', 'block'); $('#brkPlay').css('display', 'none');
      $('#sesPlay').css('display', 'none');   $('#sesPause').css('display', 'none');
    },
    work: () => {
      $('.status').text('Work');
      status.showCanvas();
    },
    break: () => {
      $('.status').text('Break');
    },
    workComplete: () => {
      $('#sesPlay').css('display', 'none');   $('#sesPause').css('display', 'none');
      $('#brkPlay').css('display', 'none');   $('#brkPause').css('display', 'block');
    },
    freeze: () => {
      $('.setting').css('pointer-events', 'none');
      $('#reset').css('display', 'none');
      $('.title, .minus, .add, .duration').addClass('freeze');
    },
    unfreeze: () => {
      $('.setting').css('pointer-events', 'auto');
      $('#reset').css('display', 'block');
      $('.title, .minus, .add, .duration').removeClass('freeze');
    },
    setWork: () => {
      $('.status').text('Set work');
      $('#ses').addClass('active'); $('#brk').removeClass('active');
      status.hideCanvas();
    },
    setBrk: () => {
      $('.status').text('Set break');
      $('#brk').addClass('active'); $('#ses').removeClass('active');
      status.hideCanvas();
    },
    display: (time) => {
      time = (time < 10) ? ('0' + time) : time;
      $('#min').text(time);
      $('#sec').text('00');
    },
    showCanvas: () => {
      $('#myCanvas').css('display', 'block'); $('#canvasBG').css('display', 'none');
    },
    hideCanvas: () => {
      $('#canvasBG').css('display', 'block'); $('#myCanvas').css('display', 'none');
    },
    audio: () => {
      new Audio('beep.mp3').play();
    },
    default: () => {
      $('.status').text('Pomodoro');
      $('#ses').removeClass('active'); $('#brk').removeClass('active');
      setCanvas.drawBG();
    }
  };

  const settings = {
    subWork: () => {
      workTime = $('#sesTime').text();
      if (workTime > 1) workTime -= 1;
      status.display(workTime);
      counter.updateWorkT(workTime);
    },
    addWork: () => {
      workTime = $('#sesTime').text();
      workTime = Number(workTime);
      if (workTime < 60) workTime += 1;
      status.display(workTime);
      counter.updateWorkT(workTime);
    },
    subBrk: () => {
      brkTime = $('#brkTime').text();
      if (brkTime > 1) brkTime -= 1;
      status.display(brkTime);
      counter.updateBrkT(brkTime);
    },
    addBrk: () => {
      brkTime = $('#brkTime').text();
      brkTime = Number(brkTime);
      if (brkTime < 60) brkTime += 1;
      status.display(brkTime);
      counter.updateBrkT(brkTime);
    }
  };

  // Play, Pause, Reset buttons
  $('#sesPlay').on('click', function() {
    status.sesPause();
    counter.workStart();
  });

  $('#sesPause').on('click', function() {
    status.sesPlay();
    counter.workPause();
  });

  $('#brkPlay').on('click', function() {
    status.brkPause();
    counter.brkStart();
  });

  $('#brkPause').on('click', function() {
    status.brkPlay();
    counter.brkPause();
  });

  $('#reset').on('click', function() {
    counter.reset();
    counter.updateWorkT(25);
    counter.updateBrkT(5);
    status.display(25);
    status.sesPlay();
    status.default();
  });

  // Modify session length and break length
  $('#ses-minus').on('click', function() {
    settings.subWork();
    status.setWork();
    status.sesPlay();
  });

  $('#ses-add').on('click', function() {
    settings.addWork();
    status.setWork();
    status.sesPlay();
  });

  $('#brk-minus').on('click', function() {
    settings.subBrk();
    status.setBrk();
    status.sesPlay();
  });

  $('#brk-add').on('click', function() {
    settings.addBrk();
    status.setBrk();
    status.sesPlay();
  });

  // Canvas for circular progress bar
  const canvas  = document.getElementById('myCanvas');
  const ctx     = canvas.getContext('2d');
  const canvasW = canvas.width;
  const canvasH = canvas.height;

  const setCanvas = {
    al: 0,
    start: 4.72,
    radius: 100,
    cw: ctx.canvas.width/2,
    ch: ctx.canvas.height/2,
    diff: 0,
    et: 0,
    workL: 25,
    gradientWork: function() {
      let gradient = ctx.createLinearGradient(80, 50, 0, 180);
      gradient.addColorStop('0'  , '#7d9ce0');
      gradient.addColorStop('0.4', '#c18cd8');
      gradient.addColorStop('1.0', '#e29591');
      return gradient;
    },
    gradientBrk: function() {
      let gradient = ctx.createLinearGradient(80, 50, 0, 180);
      gradient.addColorStop('0'  , '#ff9966');
      gradient.addColorStop('0.4', '#fcce71');
      gradient.addColorStop('1.0', '#ff5e62');
      return gradient;
    },
    drawBG: function() {
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.beginPath();
      ctx.lineWidth = 8;
      ctx.arc(this.cw, this.ch, 100, 0, 2*Math.PI, false);
      ctx.strokeStyle = '#efefef';
      ctx.stroke();
    },
    // Animate canvas for work time counter
    drawWork: function(et, workSecT) {
      let diff = (et/workSecT) * 2 * Math.PI;
      this.drawBG();
      ctx.lineWidth = 8;
      ctx.beginPath();
      // arc(x, y, radius, startAngle, endAngle, anticlockwise)
      ctx.arc(this.cw, this.ch, this.radius, this.start, diff+this.start, false);

      ctx.strokeStyle = this.gradientWork();
      ctx.lineCap = 'round';
      ctx.stroke();
    },
    drawBrk: function(et, brkSecT) {
      let diff = (et/brkSecT) * 2 * Math.PI;
      this.drawBG();
      ctx.lineWidth = 8;
      ctx.beginPath();

      ctx.arc(this.cw, this.ch, this.radius, this.start, diff+this.start, false);

      ctx.strokeStyle = this.gradientBrk();
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  setCanvas.drawBG();
});

// TODO: make arc animation smoother
