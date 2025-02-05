const ctx = document.getElementById('myChart');
const monthly = document.getElementById('monthly');
new Chart(ctx, {
  type: 'polarArea',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
    datasets: [{
      label: 'Students Present',
      data: [1, 82, 77, 90, 77, 66],
      backgroundColor: [
        'rgba(217, 237, 146, 1)',
        'rgba(26, 117, 159, 1)',
        'rgba(181, 228, 140, 1)',
        'rgba(30, 96, 145, 1)',
        'rgba(153, 217, 140, 1)',
        'rgba(24, 78, 119, 1)',
      ],

    }]
  },
  options: {
    responnsive: true,
  }
});

new Chart(monthly, {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    datasets: [{
      label: 'Students present',
      data: [88, 82, 77, 90, 77, 66, 88, 90, 77, 65, 55, 88, 65],
      backgroundColor: [
        'rgba(124, 32,	34, 1)',
        'rgba(249, 65, 68, 1)',
        'rgba(243, 114, 44, 1)',
        'rgba(248, 150, 30, 1)',
        'rgba(249, 132, 74, 1)',
        'rgba(249, 199, 79, 1)',
        'rgba(144, 190, 109, 1)',
        'rgba(67, 170, 139, 1)',
        'rgba(77, 144, 142, 1)',
        'rgba(87, 117, 144, 1)',
        'rgba(39, 125, 161, 1)',
        'rgba(19,	62,	80, 1)',
      ],

    }]
  },
  options: {
    responnsive: true,
  }
});

