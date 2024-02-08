let marketingData = [];
let ctx = document.getElementById('marketingChart').getContext('2d');
let marketingChart;

function renderBarChart(data) {
    if (marketingChart) {
        marketingChart.destroy();
    }
    marketingChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return document.getElementById('displayModeSelect').value === 'percentage' ? value + '%' : value;
                        }
                    }
                }
            }
        }
    });
}

function analyzeMarketingData(data) {
    let labels = [];
    let clicksData = [];
    let conversionsData = [];
    for (let item of data) {
        labels.push(item.campaign);
        clicksData.push(item.clicks);
        conversionsData.push(item.conversions);
    }
    return {
        labels: labels,
        datasets: [
            {
                label: 'Clicks',
                data: clicksData,
                backgroundColor: 'rgba(70, 192, 192, 0.6)',
            },
            {
                label: 'Conversions',
                data: conversionsData,
                backgroundColor: 'rgba(150, 100, 255, 1)',
            }
        ]
    };
}

function updateChart() {
    renderBarChart(analyzeMarketingData(marketingData));
}

function populateCampaignsDropdown() {
    let dropdown = document.getElementById('campaignSelect');
    dropdown.innerHTML = '<option value="" disabled selected>Select Campaign</option>';
    for (let item of marketingData) {
        let option = document.createElement('option');
        option.value = item.campaign;
        option.text = item.campaign;
        dropdown.add(option);
    }
}

function addData() {
    let campaign = document.getElementById('campaignSelect').value;
    let clicks = document.getElementById('clicksInput').value;
    let conversions = document.getElementById('conversionsInput').value;
    let item = marketingData.find(item => item.campaign === campaign);
    if (item) {
        item.clicks = Number(clicks);
        item.conversions = Number(conversions);
    } else {
        marketingData.push({
            campaign: campaign,
            clicks: Number(clicks),
            conversions: Number(conversions)
        });
    }
    updateChart();
}

function removeData() {
    let campaign = document.getElementById('campaignSelect').value;
    let item = marketingData.find(item => item.campaign === campaign);
    if (item) {
        item.clicks = 0;
        item.conversions = 0;
    }
    updateChart();
}

function addNewCampaign() {
    let newCampaignName = document.getElementById('newCampaignInput').value;
    if (newCampaignName && !marketingData.some(item => item.campaign === newCampaignName)) {
        marketingData.push({
            campaign: newCampaignName,
            clicks: 0,
            conversions: 0
        });
        populateCampaignsDropdown();
        updateChart();
    }
}

function removeSelectedCampaign() {
    let selectedCampaign = document.getElementById('campaignSelect').value;
    marketingData = marketingData.filter(item => item.campaign !== selectedCampaign);
    populateCampaignsDropdown();
    updateChart();
}

function removeAllCampaigns() {
    marketingData = [];
    populateCampaignsDropdown();
    updateChart();
}

function exportToExcel() {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(marketingData);
    XLSX.utils.book_append_sheet(wb, ws, 'Marketing Data');
    XLSX.writeFile(wb, 'marketing_data.xlsx');
}

// Initial chart rendering and dropdown population
document.addEventListener('DOMContentLoaded', function() {
    renderBarChart(analyzeMarketingData(marketingData));
    populateCampaignsDropdown();
});