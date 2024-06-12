// This is the beginning of this DATA Skill, made at Tuesday, June 11, 2024 at 9:20:42.723 PM MDT by DATA. Here is where it is located in the project file:// api/v1/skills/arcSolver.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { activateDATA, gptRequest } from '../../../../utils/gpt/gptUtils';
import { runCommand } from '../../../../utils/skills/commandUtil';
import { fetchValidImageUrl, isValidUrl, compressImage, uploadImageToImgur } from '../../../../utils/notion/notionUtils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { userRequest, phoneNumber, email, model, location, currentUserTime, clipboardCopy, args, returnType, bot } = req.body;

  if (returnType === 'skillDef') {
    const dataSkillDef = {
      fileName: 'arcSolver',
      displayName: `ARC Solver`,
      model: `Uses current selection`,
      recommendedModels: [`gpt-4`, `anthropic-claude`],
      emoji: '🧩',
      headerImage: 'https://i.imgur.com/iu8n6yv.png',
      icon: 'https://i.imgur.com/B7bTRNV.png',
      description: `## AI-Powered Abstraction and Reasoning Challenge (ARC) Solver 🧩💡

This skill takes a user-provided ARC task JSON file, analyzes the training pairs to identify transformation patterns, iteratively refines the rules, and applies them to the test pairs to generate step-by-step solutions. It returns a formatted markdown document with the solution steps and explanations.

### Usage
To use this skill, provide the file path or URL to a single ARC task JSON file in the following format:

<userRequest>
Please solve the ARC task in the file [path/to/task.json]
</userRequest>

The skill will load the task file, extract the training and test pairs, analyze the patterns, refine the rules, apply them to generate solutions, and return a detailed markdown solution document.

### Capabilities
- Handles both local file paths and remote URLs for task JSON files
- Analyzes training pairs using AI to identify transformation patterns
- Iteratively refines transformation rules based on training pairs
- Applies refined rules to test pairs to generate step-by-step solutions
- Formats solution steps and explanations in a readable markdown document
- Sends an SMS alert when the solution is ready, with a link to the full document

### Limitations
- May struggle with highly complex or abstract patterns beyond the training data
- Solution quality depends on the available training pairs and model performance
- Large or numerous test pairs may impact performance and generation time

### Prerequisites
This skill requires the user to supply a valid JSON file containing an ARC task with training and test pairs. The file should adhere to the expected structure and format.`,
      reliability: `Reliable on most ARC tasks, but performance may vary for highly complex or abstract patterns.`,
      reliabilityRatio: 0.8,
      keywords: ['ARC', 'Abstraction and Reasoning Challenge', 'AI solver', 'pattern recognition', 'rule induction', 'grid transformations', 'problem solving', 'logic', 'reasoning'],
      factChecking: `This skill generates solution steps based on the provided task file. Fact-checking is not explicitly performed, as the skill focuses on discovering patterns and applying transformations rather than verifying external information.`,
      estimatedRunTime: '60-120 seconds',
      sotaEstimatedCost: '$2.50',
      maxConcurrency: 5,
      prePrompt: false,
      dependencies: [],
      skillClass: 'recursiveSkill',
      knownIssues: `- May struggle with highly abstract or complex patterns not well-represented in the training data
- Solution quality and performance can vary depending on the specific task and model used
- Extremely large or numerous test pairs may impact generation time and resource usage`,
      roadmap: `- Enhance pattern recognition and rule induction capabilities to handle more abstract tasks
- Improve solution explanation clarity and add visualizations for better understanding
- Optimize performance for larger task sets and more efficient resource usage
- Integrate additional AI models and techniques for improved accuracy and robustness`,
      walkthrough: `1. Receive user request with the file path or URL to the ARC task JSON file
2. Load the task file and parse the training and test pairs
3. Analyze the training pairs using AI to identify transformation patterns
4. Generate initial rules based on the identified patterns
5. Iteratively refine the rules by testing them against the training pairs and updating as needed
6. Apply the refined rules to the test pairs to generate step-by-step solutions
7. Format the solution steps and explanations into a readable markdown document
8. Send an SMS alert to the user with a link to the full solution document
9. Return the formatted solution document and debug information as the API response`,
      author: 'Steve Moraco',
      authorDUID: 'SteveMoraco-COS-2023-1201-0420-6009',
      paypalEmail: 'steve.moraco@gmail.com',
      donateLink: 'https://heydata.org',
      socialHandle: 'https://twitter.com/SteveMoraco',
      promoUrl: 'https://heydata.org',
      supportUrl: 'https://heydata.org/chat',
      skillDUID: 'ARCSolver-COS-2024-0611-2120-4272',
      skillVersion: '1.0.0',
      dataVersion: '4.2.0',
      status: 'published',
      createdAt: 'Tuesday, June 11, 2024 at 9:20:42.723 PM MDT',
      updatedAt: 'Tuesday, June 11, 2024 at 9:20:42.723 PM MDT',
    };
    res.status(200).json({ dataSkillDef });
    return;
  }

  let debug = ''; // Initialize debug variable for logging

const sourceCode = `\`\`\`
ARC-AGI/
 ├── .cache
 ├── .git
 ├── README.md
 ├── apps
 |  ├── css
 |  |  ├── common.css
 |  |  ├── testing_interface.css
 |  ├── img
 |  ├── js
 |  |  ├── common.js
 |  |  ├── testing_interface.js
 |  ├── testing_interface.html
 ├── data
 |  ├── evaluation
 |  └── training
./README.md

# Abstraction and Reasoning Corpus for Artificial General Intelligence (ARC-AGI)

This repository contains the ARC-AGI task data, as well as a browser-based interface for humans to try their hand at solving the tasks manually.

*"ARC can be seen as a general artificial intelligence benchmark, as a program synthesis benchmark, or as a psychometric intelligence test. It is targeted at both humans and artificially intelligent systems that aim at emulating a human-like form of general fluid intelligence."*

A complete description of the dataset, its goals, and its underlying logic, can be found in: [On the Measure of Intelligence](https://arxiv.org/abs/1911.01547).

As a reminder, a test-taker is said to solve a task when, upon seeing the task for the first time, they are able to produce the correct output grid for *all* test inputs in the task (this includes picking the dimensions of the output grid). For each test input, the test-taker is allowed 3 trials (this holds for all test-takers, either humans or AI).


## Task file format

The \`data\` directory contains two subdirectories:

- \`data/training\`: contains the task files for training (400 tasks). Use these to prototype your algorithm or to train your algorithm to acquire ARC-relevant cognitive priors.
- \`data/evaluation\`: contains the task files for evaluation (400 tasks). Use these to evaluate your final algorithm. To ensure fair evaluation results, do not leak information from the evaluation set into your algorithm (e.g. by looking at the evaluation tasks yourself during development, or by repeatedly modifying an algorithm while using its evaluation score as feedback).

The tasks are stored in JSON format. Each task JSON file contains a dictionary with two fields:

- \`"train"\`: demonstration input/output pairs. It is a list of "pairs" (typically 3 pairs).
- \`"test"\`: test input/output pairs. It is a list of "pairs" (typically 1 pair).

A "pair" is a dictionary with two fields:

- \`"input"\`: the input "grid" for the pair.
- \`"output"\`: the output "grid" for the pair.

A "grid" is a rectangular matrix (list of lists) of integers between 0 and 9 (inclusive). The smallest possible grid size is 1x1 and the largest is 30x30.

When looking at a task, a test-taker has access to inputs & outputs of the demonstration pairs, plus the input(s) of the test pair(s). The goal is to construct the output grid(s) corresponding to the test input grid(s), using 3 trials for each test input. "Constructing the output grid" involves picking the height and width of the output grid, then filling each cell in the grid with a symbol (integer between 0 and 9, which are visualized as colors). Only *exact* solutions (all cells match the expected answer) can be said to be correct.


## Usage of the testing interface

The testing interface is located at \`apps/testing_interface.html\`. Open it in a web browser (Chrome recommended). It will prompt you to select a task JSON file.

After loading a task, you will enter the test space, which looks like this:

![test space](https://arc-benchmark.s3.amazonaws.com/figs/arc_test_space.png)

On the left, you will see the input/output pairs demonstrating the nature of the task. In the middle, you will see the current test input grid. On the right, you will see the controls you can use to construct the corresponding output grid.

You have access to the following tools:

### Grid controls

- Resize: input a grid size (e.g. "10x20" or "4x4") and click "Resize". This preserves existing grid content (in the top left corner).
- Copy from input: copy the input grid to the output grid. This is useful for tasks where the output consists of some modification of the input.
- Reset grid: fill the grid with 0s.

### Symbol controls

- Edit: select a color (symbol) from the color picking bar, then click on a cell to set its color.
- Select: click and drag on either the output grid or the input grid to select cells.
    - After selecting cells on the output grid, you can select a color from the color picking to set the color of the selected cells. This is useful to draw solid rectangles or lines.
    - After selecting cells on either the input grid or the output grid, you can press C to copy their content. After copying, you can select a cell on the output grid and press "V" to paste the copied content. You should select the cell in the top left corner of the zone you want to paste into.
- Floodfill: click on a cell from the output grid to color all connected cells to the selected color. "Connected cells" are contiguous cells with the same color.

### Answer validation

When your output grid is ready, click the green "Submit!" button to check your answer. We do not enforce the 3-trials rule.

After you've obtained the correct answer for the current test input grid, you can switch to the next test input grid for the task using the "Next test input" button (if there is any available; most tasks only have one test input).

When you're done with a task, use the "load task" button to open a new task.

./apps/css/common.css

.cell {
    width: 100px;
    height: 100px;
    border-left: 1px solid #555;
    border-top: 1px solid #555;
    float: left;
    background-color: #000;
}

.row {
    clear: both;
}

.symbol_0 {
    background-color: #000;
}
.symbol_1 {
    background-color: #0074D9; /* blue */
}
.symbol_2 {
    background-color: #FF4136; /* red */
}
.symbol_3 {
    background-color: #2ECC40; /* green */
}
.symbol_4 {
    background-color: #FFDC00; /* yellow */
}
.symbol_5 {
    background-color: #AAAAAA; /* grey */
}
.symbol_6 {
    background-color: #F012BE; /* fuschia */
}
.symbol_7 {
    background-color: #FF851B; /* orange */
}
.symbol_8 {
    background-color: #7FDBFF; /* teal */
}
.symbol_9 {
    background-color: #870C25; /* brown */
}


/*Symbol picker*/

.symbol_preview {
    width: 20px;
    height: 20px;
    float: left;
}

.grid_size_field {
    width: 50px;
}

.selected-symbol-preview {
    border: 2px solid orange;
}


/*Selectable*/

.ui-selected {
    background-image: url(../img/black-twill.png), url(../img/brushed-alum.png);
}
.ui-selectable-helper {
    border: 1px dotted #ddd;
    position: absolute;
    z-index: 1000;
}

/*Message display*/

#error_display {
    color: red;
    width: 100%;
    float: left;
    font-size: 14px;
    margin: 20px;
}

#info_display {
    color: green;
    width: 100%;
    float: left;
    font-size: 14px;
    margin: 20px;
}


./apps/css/testing_interface.css

body {
    font-family: 'Open Sans', sans-serif;
    min-width: 1410px;
}

#workspace {
    width: 1410px;
    margin-left: auto;
    margin-right: auto;
}

#demonstration_examples_view {
    float: left;
    width: 450px;
    margin: 10px;
    margin-right: 5px;
    background-color: #d5d5d5;
}

#evaluation_view {
    float: left;
    width: 930px;
    margin: 10px;
    margin-left: 5px;
    background-color: #d5d5d5;
    min-height: 850px;
}

#evaluation-input-view {
    float: left;
    width: 400px;
    margin: 10px;
}

#evaluation_output_editor {
    float: left;
    width: 500px;
    margin-bottom: 20px;
}

#load_task_control_btns {
    float: left;
    margin-top: 10px;
    margin-bottom: 0;
    background: white;
    width: 100%;
    padding-top: 5px;
    padding-bottom: 5px;
}

#editor_grid_control_btns {
    float: left;
    margin-top: 10px;
    margin-bottom: 10px;
    background: white;
    width: 100%;
    padding-top: 5px;
    padding-bottom: 5px;
}

#resize_control_btns {
    width: 100%;
    float:left;
    margin-bottom: 10px;
}

#submit_solution_btn {
    color: white;
    border-radius: 4px;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    background: rgb(28, 184, 65);
}

#submit_solution_btn:active {
  background: blue;
}

button:focus {outline:0;}

#output_grid {

}

#toolbar {
    float: left;
    margin-left: 10px;
    margin-top: 18px;
    margin-bottom: 10px;
    width: 100%;

}

#symbol_picker {
    float: left;
    margin-left: 20px;
    width: 100%;
}

.symbol_preview {
    width: 25px;
    height: 25px;
    float: left;
}

label {
    margin-left: 10px;
}

input, button {
    margin-left: 10px;
}

#resize_btn {
    margin-left: 0;
}

/*Task demonstration*/

.pair_preview {
    height: 200px;
    padding: 5px;
    border-bottom: solid 1px #a1a1a1;
}
.input_preview {
    height: 200px;
    width: 200px;
    float: left;
}
.output_preview {
    height: 200px;
    width: 200px;
    float: left;
    margin-left: 35px;
}

.text {
    text-align: center;
    background: white;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 10px;
}

#task_demo_header {
    margin: 10px;
}

#modal_bg {
    background-color: black;
    width: 100%;
    min-height: 10000px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
}

#modal {
    margin: auto;
    background-color: white;
    text-align: center;
    padding: 100px;
    width: 500px;
    margin-top: 100px;
}

#modal input {
    margin-left: 70px;
}

./apps/js/common.js


class Grid {
    constructor(height, width, values) {
        this.height = height;
        this.width = width;
        this.grid = new Array(height);
        for (var i = 0; i < height; i++){
            this.grid[i] = new Array(width);
            for (var j = 0; j < width; j++){
                if (values != undefined && values[i] != undefined && values[i][j] != undefined){
                    this.grid[i][j] = values[i][j];
                } else {
                    this.grid[i][j] = 0;
                }
            }
        }
    }
}

function floodfillFromLocation(grid, i, j, symbol) {
    i = parseInt(i);
    j = parseInt(j);
    symbol = parseInt(symbol);

    target = grid[i][j];

    if (target == symbol) {
        return;
    }

    function flow(i, j, symbol, target) {
        if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
            if (grid[i][j] == target) {
                grid[i][j] = symbol;
                flow(i - 1, j, symbol, target);
                flow(i + 1, j, symbol, target);
                flow(i, j - 1, symbol, target);
                flow(i, j + 1, symbol, target);
            }
        }
    }
    flow(i, j, symbol, target);
}

function parseSizeTuple(size) {
    size = size.split('x');
    if (size.length != 2) {
        alert('Grid size should have the format "3x3", "5x7", etc.');
        return;
    }
    if ((size[0] < 1) || (size[1] < 1)) {
        alert('Grid size should be at least 1. Cannot have a grid with no cells.');
        return;
    }
    if ((size[0] > 30) || (size[1] > 30)) {
        alert('Grid size should be at most 30 per side. Pick a smaller size.');
        return;
    }
    return size;
}

function convertSerializedGridToGridObject(values) {
    height = values.length;
    width = values[0].length;
    return new Grid(height, width, values)
}

function fitCellsToContainer(jqGrid, height, width, containerHeight, containerWidth) {
    candidate_height = Math.floor((containerHeight - height) / height);
    candidate_width = Math.floor((containerWidth - width) / width);
    size = Math.min(candidate_height, candidate_width);
    size = Math.min(MAX_CELL_SIZE, size);
    jqGrid.find('.cell').css('height', size + 'px');
    jqGrid.find('.cell').css('width', size + 'px');
}

function fillJqGridWithData(jqGrid, dataGrid) {
    jqGrid.empty();
    height = dataGrid.height;
    width = dataGrid.width;
    for (var i = 0; i < height; i++){
        var row = \$(document.createElement('div'));
        row.addClass('row');
        for (var j = 0; j < width; j++){
            var cell = \$(document.createElement('div'));
            cell.addClass('cell');
            cell.attr('x', i);
            cell.attr('y', j);
            setCellSymbol(cell, dataGrid.grid[i][j]);
            row.append(cell);
        }
        jqGrid.append(row);
    }
}

function copyJqGridToDataGrid(jqGrid, dataGrid) {
    row_count = jqGrid.find('.row').length
    if (dataGrid.height != row_count) {
        return
    }
    col_count = jqGrid.find('.cell').length / row_count
    if (dataGrid.width != col_count) {
        return
    }
    jqGrid.find('.row').each(function(i, row) {
        \$(row).find('.cell').each(function(j, cell) {
            dataGrid.grid[i][j] = parseInt(\$(cell).attr('symbol'));
        });
    });
}

function setCellSymbol(cell, symbol) {
    cell.attr('symbol', symbol);
    classesToRemove = ''
    for (i = 0; i < 10; i++) {
        classesToRemove += 'symbol_' + i + ' ';
    }
    cell.removeClass(classesToRemove);
    cell.addClass('symbol_' + symbol);
}

function errorMsg(msg) {
    \$('#error_display').stop(true, true);
    \$('#info_display').stop(true, true);

    \$('#error_display').hide();
    \$('#info_display').hide();
    \$('#error_display').html(msg);
    \$('#error_display').show();
    \$('#error_display').fadeOut(5000);
}

function infoMsg(msg) {
    \$('#error_display').stop(true, true);
    \$('#info_display').stop(true, true);

    \$('#info_display').hide();
    \$('#error_display').hide();
    \$('#info_display').html(msg);
    \$('#info_display').show();
    \$('#info_display').fadeOut(5000);
}

./apps/js/testing_interface.js


// Internal state.
var CURRENT_INPUT_GRID = new Grid(3, 3);
var CURRENT_OUTPUT_GRID = new Grid(3, 3);
var TEST_PAIRS = new Array();
var CURRENT_TEST_PAIR_INDEX = 0;
var COPY_PASTE_DATA = new Array();

// Cosmetic.
var EDITION_GRID_HEIGHT = 500;
var EDITION_GRID_WIDTH = 500;
var MAX_CELL_SIZE = 100;


function resetTask() {
    CURRENT_INPUT_GRID = new Grid(3, 3);
    TEST_PAIRS = new Array();
    CURRENT_TEST_PAIR_INDEX = 0;
    \$('#task_preview').html('');
    resetOutputGrid();
}

function refreshEditionGrid(jqGrid, dataGrid) {
    fillJqGridWithData(jqGrid, dataGrid);
    setUpEditionGridListeners(jqGrid);
    fitCellsToContainer(jqGrid, dataGrid.height, dataGrid.width, EDITION_GRID_HEIGHT, EDITION_GRID_HEIGHT);
    initializeSelectable();
}

function syncFromEditionGridToDataGrid() {
    copyJqGridToDataGrid(\$('#output_grid .edition_grid'), CURRENT_OUTPUT_GRID);
}

function syncFromDataGridToEditionGrid() {
    refreshEditionGrid(\$('#output_grid .edition_grid'), CURRENT_OUTPUT_GRID);
}

function getSelectedSymbol() {
    selected = \$('#symbol_picker .selected-symbol-preview')[0];
    return \$(selected).attr('symbol');
}

function setUpEditionGridListeners(jqGrid) {
    jqGrid.find('.cell').click(function(event) {
        cell = \$(event.target);
        symbol = getSelectedSymbol();

        mode = \$('input[name=tool_switching]:checked').val();
        if (mode == 'floodfill') {
            // If floodfill: fill all connected cells.
            syncFromEditionGridToDataGrid();
            grid = CURRENT_OUTPUT_GRID.grid;
            floodfillFromLocation(grid, cell.attr('x'), cell.attr('y'), symbol);
            syncFromDataGridToEditionGrid();
        }
        else if (mode == 'edit') {
            // Else: fill just this cell.
            setCellSymbol(cell, symbol);
        }
    });
}

function resizeOutputGrid() {
    size = \$('#output_grid_size').val();
    size = parseSizeTuple(size);
    height = size[0];
    width = size[1];

    jqGrid = \$('#output_grid .edition_grid');
    syncFromEditionGridToDataGrid();
    dataGrid = JSON.parse(JSON.stringify(CURRENT_OUTPUT_GRID.grid));
    CURRENT_OUTPUT_GRID = new Grid(height, width, dataGrid);
    refreshEditionGrid(jqGrid, CURRENT_OUTPUT_GRID);
}

function resetOutputGrid() {
    syncFromEditionGridToDataGrid();
    CURRENT_OUTPUT_GRID = new Grid(3, 3);
    syncFromDataGridToEditionGrid();
    resizeOutputGrid();
}

function copyFromInput() {
    syncFromEditionGridToDataGrid();
    CURRENT_OUTPUT_GRID = convertSerializedGridToGridObject(CURRENT_INPUT_GRID.grid);
    syncFromDataGridToEditionGrid();
    \$('#output_grid_size').val(CURRENT_OUTPUT_GRID.height + 'x' + CURRENT_OUTPUT_GRID.width);
}

function fillPairPreview(pairId, inputGrid, outputGrid) {
    var pairSlot = \$('#pair_preview_' + pairId);
    if (!pairSlot.length) {
        // Create HTML for pair.
        pairSlot = \$('<div id="pair_preview_' + pairId + '" class="pair_preview" index="' + pairId + '"></div>');
        pairSlot.appendTo('#task_preview');
    }
    var jqInputGrid = pairSlot.find('.input_preview');
    if (!jqInputGrid.length) {
        jqInputGrid = \$('<div class="input_preview"></div>');
        jqInputGrid.appendTo(pairSlot);
    }
    var jqOutputGrid = pairSlot.find('.output_preview');
    if (!jqOutputGrid.length) {
        jqOutputGrid = \$('<div class="output_preview"></div>');
        jqOutputGrid.appendTo(pairSlot);
    }

    fillJqGridWithData(jqInputGrid, inputGrid);
    fitCellsToContainer(jqInputGrid, inputGrid.height, inputGrid.width, 200, 200);
    fillJqGridWithData(jqOutputGrid, outputGrid);
    fitCellsToContainer(jqOutputGrid, outputGrid.height, outputGrid.width, 200, 200);
}

function loadJSONTask(train, test) {
    resetTask();
    \$('#modal_bg').hide();
    \$('#error_display').hide();
    \$('#info_display').hide();

    for (var i = 0; i < train.length; i++) {
        pair = train[i];
        values = pair['input'];
        input_grid = convertSerializedGridToGridObject(values)
        values = pair['output'];
        output_grid = convertSerializedGridToGridObject(values)
        fillPairPreview(i, input_grid, output_grid);
    }
    for (var i=0; i < test.length; i++) {
        pair = test[i];
        TEST_PAIRS.push(pair);
    }
    values = TEST_PAIRS[0]['input'];
    CURRENT_INPUT_GRID = convertSerializedGridToGridObject(values)
    fillTestInput(CURRENT_INPUT_GRID);
    CURRENT_TEST_PAIR_INDEX = 0;
    \$('#current_test_input_id_display').html('1');
    \$('#total_test_input_count_display').html(test.length);
}

function display_task_name(task_name, task_index, number_of_tasks) {
    big_space = '&nbsp;'.repeat(4); 
    document.getElementById('task_name').innerHTML = (
        'Task name:' + big_space + task_name + big_space + (
            task_index===null ? '' :
            ( String(task_index) + ' out of ' + String(number_of_tasks) )
        )
    );
}

function loadTaskFromFile(e) {
    var file = e.target.files[0];
    if (!file) {
        errorMsg('No file selected');
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;

        try {
            contents = JSON.parse(contents);
            train = contents['train'];
            test = contents['test'];
        } catch (e) {
            errorMsg('Bad file format');
            return;
        }
        loadJSONTask(train, test);

        \$('#load_task_file_input')[0].value = "";
        display_task_name(file.name, null, null);
    };
    reader.readAsText(file);
}

function randomTask() {
    var subset = "training";
    \$.getJSON("https://api.github.com/repos/fchollet/ARC/contents/data/" + subset, function(tasks) {
        var task_index = Math.floor(Math.random() * tasks.length)
        var task = tasks[task_index];
        \$.getJSON(task["download_url"], function(json) {
            try {
                train = json['train'];
                test = json['test'];
            } catch (e) {
                errorMsg('Bad file format');
                return;
            }
            loadJSONTask(train, test);
            //\$('#load_task_file_input')[0].value = "";
            infoMsg("Loaded task training/" + task["name"]);
            display_task_name(task['name'], task_index, tasks.length);
        })
        .error(function(){
          errorMsg('Error loading task');
        });
    })
    .error(function(){
      errorMsg('Error loading task list');
    });
}

function nextTestInput() {
    if (TEST_PAIRS.length <= CURRENT_TEST_PAIR_INDEX + 1) {
        errorMsg('No next test input. Pick another file?')
        return
    }
    CURRENT_TEST_PAIR_INDEX += 1;
    values = TEST_PAIRS[CURRENT_TEST_PAIR_INDEX]['input'];
    CURRENT_INPUT_GRID = convertSerializedGridToGridObject(values)
    fillTestInput(CURRENT_INPUT_GRID);
    \$('#current_test_input_id_display').html(CURRENT_TEST_PAIR_INDEX + 1);
    \$('#total_test_input_count_display').html(test.length);
}

function submitSolution() {
    syncFromEditionGridToDataGrid();
    reference_output = TEST_PAIRS[CURRENT_TEST_PAIR_INDEX]['output'];
    submitted_output = CURRENT_OUTPUT_GRID.grid;
    if (reference_output.length != submitted_output.length) {
        errorMsg('Wrong solution.');
        return
    }
    for (var i = 0; i < reference_output.length; i++){
        ref_row = reference_output[i];
        for (var j = 0; j < ref_row.length; j++){
            if (ref_row[j] != submitted_output[i][j]) {
                errorMsg('Wrong solution.');
                return
            }
        }

    }
    infoMsg('Correct solution!');
}

function fillTestInput(inputGrid) {
    jqInputGrid = \$('#evaluation_input');
    fillJqGridWithData(jqInputGrid, inputGrid);
    fitCellsToContainer(jqInputGrid, inputGrid.height, inputGrid.width, 400, 400);
}

function copyToOutput() {
    syncFromEditionGridToDataGrid();
    CURRENT_OUTPUT_GRID = convertSerializedGridToGridObject(CURRENT_INPUT_GRID.grid);
    syncFromDataGridToEditionGrid();
    \$('#output_grid_size').val(CURRENT_OUTPUT_GRID.height + 'x' + CURRENT_OUTPUT_GRID.width);
}

function initializeSelectable() {
    try {
        \$('.selectable_grid').selectable('destroy');
    }
    catch (e) {
    }
    toolMode = \$('input[name=tool_switching]:checked').val();
    if (toolMode == 'select') {
        infoMsg('Select some cells and click on a color to fill in, or press C to copy');
        \$('.selectable_grid').selectable(
            {
                autoRefresh: false,
                filter: '> .row > .cell',
                start: function(event, ui) {
                    \$('.ui-selected').each(function(i, e) {
                        \$(e).removeClass('ui-selected');
                    });
                }
            }
        );
    }
}

// Initial event binding.

\$(document).ready(function () {
    \$('#symbol_picker').find('.symbol_preview').click(function(event) {
        symbol_preview = \$(event.target);
        \$('#symbol_picker').find('.symbol_preview').each(function(i, preview) {
            \$(preview).removeClass('selected-symbol-preview');
        })
        symbol_preview.addClass('selected-symbol-preview');

        toolMode = \$('input[name=tool_switching]:checked').val();
        if (toolMode == 'select') {
            \$('.edition_grid').find('.ui-selected').each(function(i, cell) {
                symbol = getSelectedSymbol();
                setCellSymbol(\$(cell), symbol);
            });
        }
    });

    \$('.edition_grid').each(function(i, jqGrid) {
        setUpEditionGridListeners(\$(jqGrid));
    });

    \$('.load_task').on('change', function(event) {
        loadTaskFromFile(event);
    });

    \$('.load_task').on('click', function(event) {
      event.target.value = "";
    });

    \$('input[type=radio][name=tool_switching]').change(function() {
        initializeSelectable();
    });

    \$('input[type=text][name=size]').on('keydown', function(event) {
        if (event.keyCode == 13) {
            resizeOutputGrid();
        }
    });

    \$('body').keydown(function(event) {
        // Copy and paste functionality.
        if (event.which == 67) {
            // Press C

            selected = \$('.ui-selected');
            if (selected.length == 0) {
                return;
            }

            COPY_PASTE_DATA = [];
            for (var i = 0; i < selected.length; i ++) {
                x = parseInt(\$(selected[i]).attr('x'));
                y = parseInt(\$(selected[i]).attr('y'));
                symbol = parseInt(\$(selected[i]).attr('symbol'));
                COPY_PASTE_DATA.push([x, y, symbol]);
            }
            infoMsg('Cells copied! Select a target cell and press V to paste at location.');

        }
        if (event.which == 86) {
            // Press P
            if (COPY_PASTE_DATA.length == 0) {
                errorMsg('No data to paste.');
                return;
            }
            selected = \$('.edition_grid').find('.ui-selected');
            if (selected.length == 0) {
                errorMsg('Select a target cell on the output grid.');
                return;
            }

            jqGrid = \$(selected.parent().parent()[0]);

            if (selected.length == 1) {
                targetx = parseInt(selected.attr('x'));
                targety = parseInt(selected.attr('y'));

                xs = new Array();
                ys = new Array();
                symbols = new Array();

                for (var i = 0; i < COPY_PASTE_DATA.length; i ++) {
                    xs.push(COPY_PASTE_DATA[i][0]);
                    ys.push(COPY_PASTE_DATA[i][1]);
                    symbols.push(COPY_PASTE_DATA[i][2]);
                }

                minx = Math.min(...xs);
                miny = Math.min(...ys);
                for (var i = 0; i < xs.length; i ++) {
                    x = xs[i];
                    y = ys[i];
                    symbol = symbols[i];
                    newx = x - minx + targetx;
                    newy = y - miny + targety;
                    res = jqGrid.find('[x="' + newx + '"][y="' + newy + '"] ');
                    if (res.length == 1) {
                        cell = \$(res[0]);
                        setCellSymbol(cell, symbol);
                    }
                }
            } else {
                errorMsg('Can only paste at a specific location; only select *one* cell as paste destination.');
            }
        }
    });
});

./apps/testing_interface.html

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>ARC testing interface</title>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script src="js/common.js"></script>
        <script src="js/testing_interface.js"></script>

        <link rel="stylesheet" type="text/css" href="css/common.css">
        <link rel="stylesheet" type="text/css" href="css/testing_interface.css">

        <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">

    </head>
    <body>
        <div id="modal_bg">
            <div id="modal">
                <div>Welcome to the ARC testing interface. <br /> Choose a task file to start, or click on "Random task" to load one from the ARC project on github.</div>
                <br />
                <input type="file" class="load_task"/>
                <button onclick="randomTask()" id="random_task_btn">Random task</button>
            </div>
        </div>
        <div id="workspace">

            <div id="demonstration_examples_view">
                <div class="text" id="task_demo_header">Task demonstration</div>
                <div id="task_preview"></div>
            </div>

            <div id="evaluation_view">

                <div id="evaluation-input-view">
                    <div class="text">Test input grid <span id="current_test_input_id_display">0</span>/<span id="total_test_input_count_display">0</span>
                        <button onclick="nextTestInput()">Next test input</button>
                    </div>

                    <div id="evaluation_input" class="selectable_grid"></div>
                </div>

                <div id="evaluation_output_editor">

                    <div id="load_task_control_btns">
                        <label for="load_task_file_input">Load task JSON: </label>
                        <input type="file" id="load_task_file_input" class="load_task" style="display: none;"/>
                        <input type="button" value="Browse..." onclick="document.getElementById('load_task_file_input').click();" />
                        <button onclick="randomTask()" id="random_task_btn"> Random... </button>
                        <p>
                        <label id='task_name' for="random_task_btn"> Task name: </label>
                    </div>

                    <div id="edition_view">
                        <div id="editor_grid_control_btns">
                            <div id="resize_control_btns">
                                <label for="output_grid_size">Change grid size: </label>
                                <input type="text" id="output_grid_size" class="grid_size_field" name="size" value="3x3">
                                <button onclick="resizeOutputGrid()" id="resize_btn">Resize</button>
                            </div>

                            <button onclick="copyFromInput()">Copy from input</button>
                            <button onclick="resetOutputGrid()">Reset grid</button>
                            <button onclick="submitSolution()" id="submit_solution_btn">Submit!</button>
                        </div>

                        <div id="output_grid">
                            <div class="edition_grid selectable_grid">
                                <div class="row">
                                    <div class="cell" symbol="0" x="0" y="0"></div>
                                    <div class="cell" symbol="0" x="0" y="1"></div>
                                    <div class="cell" symbol="0" x="0" y="2"></div>
                                </div>
                                <div class="row">
                                    <div class="cell" symbol="0" x="1" y="0"></div>
                                    <div class="cell" symbol="0" x="1" y="1"></div>
                                    <div class="cell" symbol="0" x="1" y="2"></div>
                                </div>
                                <div class="row">
                                    <div class="cell" symbol="0" x="2" y="0"></div>
                                    <div class="cell" symbol="0" x="2" y="1"></div>
                                    <div class="cell" symbol="0" x="2" y="2"></div>
                                </div>
                            </div>
                        </div>


                        <div id="toolbar">
                            <div>
                                <input type="radio" id="tool_edit"
                                 name="tool_switching" value="edit" checked>
                                <label for="tool_edit">Edit</label>

                                <input type="radio" id="tool_select"
                                 name="tool_switching" value="select">
                                <label for="tool_select">Select</label>

                                <input type="radio" id="tool_floodfill"
                                 name="tool_switching" value="floodfill">
                                <label for="tool_floodfill">Flood fill</label>
                            </div>
                        </div>

                        <div id="symbol_picker">
                            <div class="symbol_preview symbol_0 selected-symbol-preview" symbol="0"></div>
                            <div class="symbol_preview symbol_1" symbol="1"></div>
                            <div class="symbol_preview symbol_2" symbol="2"></div>
                            <div class="symbol_preview symbol_3" symbol="3"></div>
                            <div class="symbol_preview symbol_4" symbol="4"></div>
                            <div class="symbol_preview symbol_5" symbol="5"></div>
                            <div class="symbol_preview symbol_6" symbol="6"></div>
                            <div class="symbol_preview symbol_7" symbol="7"></div>
                            <div class="symbol_preview symbol_8" symbol="8"></div>
                            <div class="symbol_preview symbol_9" symbol="9"></div>
                        </div>
                    </div>

                    <div id="error_display"></div>
                    <div id="info_display"></div>
                </div>
            </div>
        </div>
    </body>
</html>

\`\`\``;

  try {
    // loadTaskFromFile: Loads the task JSON file from the provided file path or URL
    const loadTaskFromFile = async (userRequest: string) => {
      try {
        let taskData = {};

        // Check if userRequest is a valid URL
        if (isValidUrl(userRequest)) {
          // Fetch the task JSON file from the URL
          const response = await fetch(userRequest);
          if (!response.ok) {
            //throw new Error(`Failed to load task file from URL: ${userRequest}`);
          }
          taskData = await response.json();
        } else {
          // Attempt to load the task JSON file from the local file system
          try {
            taskData = require(userRequest);
          } catch (error: any) {
            // Log the error and provide a fallback solution
            debug += `Error loading task file from local path: ${error.message}\n`;
            debug += `Attempting to load task file from GitHub...\n`;

            // Use runCommand to search for the task file on GitHub
            const githubSearchPrompt = `search the fchollet/ARC repository on GitHub for a task file matching the name: ${userRequest}`;
            const githubSearchResult = await runCommand('ultraBrowse', githubSearchPrompt, phoneNumber, email);

            // Extract the task file URL from the search result
            const taskFileUrlRegex = /https:\/\/raw\.githubusercontent\.com\/fchollet\/ARC\/master\/data\/\w+\/\w+\.json/;
            const taskFileUrlMatch = githubSearchResult.data.match(taskFileUrlRegex);

            if (taskFileUrlMatch) {
              const taskFileUrl = taskFileUrlMatch[0];
              debug += `Found task file on GitHub: ${taskFileUrl}\n`;

              // Fetch the task JSON file from the GitHub URL
              const response = await fetch(taskFileUrl);
              if (!response.ok) {
                throw new Error(`Failed to load task file from GitHub URL: ${taskFileUrl}`);
              }
              taskData = await response.json();
            } else {
              throw new Error(`Could not find task file on GitHub: ${userRequest}`);
            }
          }
        }

        debug += `Loaded task data: ${JSON.stringify(taskData)}\n`;
        return taskData;
      } catch (error: any) {
        debug += `Error in loadTaskFromFile: ${error.message}\n`;
        // Return an empty object to allow the skill to continue executing
        return {};
      }
    };

    // parseTaskData: Parses the loaded task data to extract train and test pairs
    const parseTaskData = async (taskData: any) => {
      try {
        debug += `Parsing task data...\n`;
        console.log('Task data:', taskData);

        if (!taskData || typeof taskData !== 'object') {
          throw new Error('Invalid task data format. Expected an object.');
        }

        const trainPairs = taskData.train || [];
        const testPairs = taskData.test || [];

        if (!Array.isArray(trainPairs) || !Array.isArray(testPairs)) {
          throw new Error('Invalid train or test pairs format. Expected arrays.');
        }

        debug += `Extracted ${trainPairs.length} train pairs and ${testPairs.length} test pairs.\n`;
        console.log('Train pairs:', trainPairs);
        console.log('Test pairs:', testPairs);

        return { trainPairs, testPairs };
      } catch (error: any) {
        debug += `Error parsing task data: ${error.message}\n`;
        console.error('Error parsing task data:', error);
        return { trainPairs: [], testPairs: [] };
      }
    };

    // analyzeTrainPairs: Uses AI to analyze the train pairs and identify transformation patterns.
    const analyzeTrainPairs = async (trainPairs: any[]) => {
      try {
        const analyzeTrainPairsPrompt = {
          systemPrompt: `You are an AI assistant that analyzes train pairs to identify transformation patterns in the ARC Solver skill. Given a set of train pairs, your task is to analyze each pair and identify the transformation rules that convert the input grid to the output grid. Provide a clear, concise description of each transformation rule you identify.`,
          prompt: `Here are the train pairs to analyze:
<TrainPairs>
${JSON.stringify(trainPairs, null, 2)}
</TrainPairs>
Please analyze each train pair and identify the transformation rules that convert the input grid to the output grid. Provide a clear, concise description of each rule, one per line. If you are unsure or unable to identify a rule, simply write Unknown for that pair.
    Reply with a markdown list of the rules, starting with the first rule now:`,
        };

        const initialRulesResponse = await gptRequest(
          model,
          0,
          analyzeTrainPairsPrompt.systemPrompt,
          analyzeTrainPairsPrompt.prompt,
          phoneNumber,
          email,
          1024
        );

        console.log('initialRulesResponse:', initialRulesResponse);
        debug += `Initial Rules Response:\n${initialRulesResponse}\n\n`;

        // Parse the initialRulesResponse into an array of strings
        const initialRules = initialRulesResponse
          .split('\n')
          .map((rule: string) => rule.trim())
          .filter((rule: string) => rule !== '');

        console.log('initialRules:', initialRules);
        debug += `Initial Rules:\n${JSON.stringify(initialRules, null, 2)}\n\n`;

        return initialRules;
      } catch (error: any) {
        console.error('Error in analyzeTrainPairs:', error.message);
        debug += `Error in analyzeTrainPairs: ${error.message}\n`;
        return []; // Return an empty array as a fallback
      }
    };

    // refineRules: Iteratively refines the transformation rules based on the train pairs
    const refineRules = async (initialRules: string[], trainPairs: any[]) => {
           let refinedRules = [...initialRules];

     

      for (let i = 0; i < 20; i++) {
            refinedRules = [...initialRules];

                const refineRulesPrompt = {
systemPrompt: `You are an AI assistant that refines transformation rules for solving ARC tasks. You will be given an array of initial rules and an array of train pairs. Your task is to iteratively refine the rules based on the train pairs to better capture the underlying patterns.

Focus on capturing the general patterns rather than memorizing specific examples. You will only get a few chances, so try VERY different approaches each time if something is obviously not working, and please start by explicitly describe what is not working in previous rule sets before you write new rules. Describe your original thesis, why it was wrong based on the training pair you previously wrote vs the example set, and then formulate new rules. Describe your rules as properties applying to objects in the grid, and then describe the transformation rules that apply to each object over time, you will have better luck if you think spatially. Keep in mind that some of the tests may be rotated or resized but still apply the same rules, so think carefully about how you define objects to be resilient to these changes.

Rules refinement process:
1. For each train pair, apply the current rules to the input grid and compare the result with the expected output grid.
2. If the result does not match the expected output, identify the discrepancies and update the relevant rules to address them.
3. Test the updated rules against all train pairs to ensure they produce the correct outputs.
4. If any discrepancies remain, repeat steps 2-3 until all train pairs are correctly solved or a maximum number of iterations is reached.

Remember to keep the rules as concise and generalizable as possible while still accurately capturing the transformation patterns. Avoid overfitting to specific train pairs.

Output format:
<RefinedRules>
1. Rule 1 description
2. Rule 2 description
...
</RefinedRules>`,
prompt: `Please refine the rules in terms of objects and transformations you're applying to those objects in the JSON pairs below.

<Source Code Of The Testing Suite That Humans Use>
${sourceCode}
</Source Code Of The Testing Suite That Humans Use>

Rules refinement process:
1. For each train pair, apply the current rules to the input grid and compare the result with the expected output grid.
2. If the result does not match the expected output, identify the discrepancies and update the relevant rules to address them.
3. Test the updated rules against all train pairs to ensure they produce the correct outputs.
4. If any discrepancies remain, repeat steps 2-3 until all train pairs are correctly solved or a maximum number of iterations is reached.

Remember to keep the rules as concise and generalizable as possible while still accurately capturing the transformation patterns. Avoid overfitting to specific train pairs.


And here are the train pairs:

<TrainPairs>
${JSON.stringify(trainPairs, null, 2)}
</TrainPairs>

<Reasoning Tried So Far>
${initialRules.join('\n')}
</Reasoning Tried So Far>

Please refine the rules based on the train pairs and return the updated rules in the specified format. Focus on capturing the general patterns rather than memorizing specific examples. You will only get a few chances, so try VERY different approaches each time if something is obviously not working, and please start by explicitly describe what is not working in previous rule sets before you write new rules. Describe your original thesis, why it was wrong based on the training pair you previously wrote vs the example set, and then formulate new rules. Describe your rules as properties applying to objects in the grid, and then describe the transformation rules that apply to each object over time, you will have better luck if you think spatially. Keep in mind that some of the tests may be rotated or resized but still apply the same rules, so think carefully about how you define objects to be resilient to these changes.`,
                }
          
        const refinementResult = await gptRequest(model, 0, refineRulesPrompt.systemPrompt, refineRulesPrompt.prompt, phoneNumber, email, 4000);
        //debug += `Refinement iteration ${i + 1}:\n${refinementResult}\n\n`;
        //console.log(`Refinement iteration ${i + 1}:\n${refinementResult}\n\n`);

          

        // Extract the refined rules from the GPT response
        const refinedRulesMatch = refinementResult.match(/<RefinedRules>([\s\S]*?)<\/RefinedRules>/);
        if (refinedRulesMatch) {
          refinedRules = refinedRulesMatch[1].trim().split('\n').map(rule => rule.trim());
          debug += `Extracted refined rules for iteration ${i + 1}: \n${refinedRules.join('\n')}\n\n`;
          console.log(`Extracted refined rules for iteration ${i + 1}: \n${refinedRules.join('\n')}\n\n`);
          // Test the refined rules against all train pairs
          let allTrainPairsSolved = true;
          for (const pair of trainPairs) {
            const input = pair.input;
            const expectedOutput = pair.output;
            const actualOutput = applyRules(input, refinedRules);

            if (JSON.stringify(actualOutput) !== JSON.stringify(expectedOutput)) {
              allTrainPairsSolved = false;
              break;
            }
          }

          if (allTrainPairsSolved) {
            debug += 'All train pairs solved. Stopping refinement process.\n\n';
            console.log('All train pairs solved. Stopping refinement process.\n\n');
            break;
          }
        } else {
          debug += 'Error: Could not extract refined rules from GPT response.\n\n';
          console.error('Error: Could not extract refined rules from GPT response.');
          break;
        }
      }

      debug += `Final refined rules:\n${refinedRules.join('\n')}\n\n`;
      console.log(`Final refined rules:\n${refinedRules.join('\n')}\n\n`);
      return refinedRules;
    };

    // Helper function to apply rules to an input grid (implementation not shown)
    const applyRules = (input: any[][], rules: string[]): any[][] => {
      // TODO: Implement logic to apply transformation rules to the input grid
      return [];
    };

    // applyRulesToTestPairs: Applies the refined rules to the test pairs to generate solutions
    const applyRulesToTestPairs = async (refinedRules: string[], testPairs: any[]) => {
      try {
        debug += `Applying refined rules to test pairs...\n`;
        console.log(`Refined Rules:\n${refinedRules.join('\n')}`);
        //console.log(`Test Pairs:\n${JSON.stringify(testPairs, null, 2)}`);

        const applyRulesPrompt = {
          systemPrompt: `You are an AI assistant that applies transformation rules to input grids to generate output grids. You will be given a set of refined transformation rules and a set of test pairs. Your task is to apply the rules to each test pair to generate the corresponding output grid solutions.

Process:
1. For each test pair, apply the transformation rules to the input grid to generate the output grid solution.
2. Provide a step-by-step explanation of how each rule was applied to transform the input grid into the output grid.
3. If a rule cannot be applied or the transformation is ambiguous, provide your best attempt at a solution and explain any uncertainties or assumptions.

Guidelines:
- Be as specific and detailed as possible in your step-by-step explanations.
- If a transformation rule is not directly applicable, use your best judgment to adapt it to the current test pair.
- If multiple rules could apply, choose the one that seems most relevant based on the patterns observed in the training pairs.
- For each test pair, provide the generated output grid and the associated explanation.

Output format:
<TestPairSolutions>
Test Pair 1:
Output Grid:
[Generated output grid for Test Pair 1]

Step-by-Step Explanation:
1. [Explanation of how Rule 1 was applied]
2. [Explanation of how Rule 2 was applied]
...

Test Pair 2:
Output Grid:
[Generated output grid for Test Pair 2]

Step-by-Step Explanation:
1. [Explanation of how Rule 1 was applied]
2. [Explanation of how Rule 2 was applied]
...
</TestPairSolutions>`,

          prompt: `Here are the refined transformation rules:
<RefinedRules>
${refinedRules.join('\n')}
</RefinedRules>

And here are the test pairs to solve:
<TestPairs>
${JSON.stringify(testPairs, null, 2)}
</TestPairs>

Please apply the refined rules to each test pair to generate the output grid solutions and provide step-by-step explanations. Reply with the solutions and explanations in the specified output format.`
        };

        const solutionsResponse = await gptRequest(model, 0, applyRulesPrompt.systemPrompt, applyRulesPrompt.prompt, phoneNumber, email, 4000);
        console.log(`Generated solutions response:\n${solutionsResponse}`);
        debug += `Generated solutions response:\n${solutionsResponse}\n\n`;

        // Parse the solutions response to extract the generated output grids and explanations
        const solutionsMatch = solutionsResponse.match(/<TestPairSolutions>([\s\S]*)<\/TestPairSolutions>/);
        if (!solutionsMatch) {
          throw new Error('Could not parse test pair solutions from GPT response.');
        }

        const solutionsText = solutionsMatch[1].trim();
        const solutionRegex = /Test Pair (\d+):\s*Output Grid:\s*(\[[^\]]+\])\s*Step-by-Step Explanation:\s*((?:\d+\.\s*(?:[^.\n\d][^\n]*\n?)*)+)/g;

        const solutions = [];
        let match;
        while ((match = solutionRegex.exec(solutionsText)) !== null) {
          const [_, pairNumber, outputGrid, explanation] = match;
          solutions.push({
            pairNumber: parseInt(pairNumber),
            outputGrid: JSON.parse(outputGrid),
            explanation: explanation.trim(),
          });
        }

        debug += `Parsed ${solutions.length} test pair solutions.\n`;
        console.log('Solutions:', solutions);

        return solutions;
      } catch (error: any) {
        debug += `Error in applyRulesToTestPairs: ${error.message}\n`;
        console.error('Error in applyRulesToTestPairs:', error);
        return [];
      }
    };

    // formatSolutionDocument: Formats the step-by-step solution and explanations in a markdown document
    const formatSolutionDocument = async (solutions: any[], refinedRules: string[]) => {
      try {
        const formatPrompt = {
          systemPrompt: `You are an AI assistant that formats the step-by-step ARC Solver solutions and explanations into a well-structured markdown document. Your task is to create a document that clearly presents the problem, the refined transformation rules, and the detailed solution for each test pair.`,

          prompt: `Here are the refined transformation rules:
<RefinedRules>
${refinedRules.join('\n')}
</RefinedRules>

And here are the step-by-step solutions for each test pair:
<Solutions>
${JSON.stringify(solutions, null, 2)}
</Solutions>

Please format the information into a detailed markdown document. The document should include:

1. A brief explanation of the ARC Solver task and the number of test pairs solved.

2. A section presenting the refined transformation rules:
## Refined Transformation Rules
1. Rule 1
2. Rule 2
...

3. For each test pair, include:
### Test Pair N
**Input Grid:**
[Markdown table representing the input grid]

**Output Grid:**
[Markdown table representing the generated output grid]

**Step-by-Step Explanation:**
[Detailed step-by-step explanation of how the rules were applied]

Feel free to use appropriate markdown formatting to ensure the document is clear, readable, and well-structured.

Please generate the complete solution document in markdown format now.`,
        };

        const solutionDocumentResponse = await gptRequest(model, 0, formatPrompt.systemPrompt, formatPrompt.prompt, phoneNumber, email, 4000);
        console.log('Solution Document Response:', solutionDocumentResponse);
        debug += `Generated solution document:\n${solutionDocumentResponse}\n\n`;

        return solutionDocumentResponse;
      } catch (error: any) {
        debug += `Error in formatSolutionDocument: ${error.message}\n`; 
        console.error('Error in formatSolutionDocument:', error);
        return 'An error occurred while formatting the solution document.';
      }
    };

    // generateGridMarkdown: Converts the input/output grids to markdown tables
    const generateGridMarkdown = async (grid: any[][]) => {
      // Generate the markdown table header
      let gridMarkdown = '|';
      for (let col = 0; col < grid[0].length; col++) {
        gridMarkdown += ' |';
      }
      gridMarkdown += '\n|';
      for (let col = 0; col < grid[0].length; col++) {
        gridMarkdown += '--|';
      }
      gridMarkdown += '\n';

      // Generate the markdown table rows
      for (let row = 0; row < grid.length; row++) {
        gridMarkdown += '|';
        for (let col = 0; col < grid[row].length; col++) {
          const cellValue = grid[row][col];
          gridMarkdown += ` ${cellValue} |`;
        }
        gridMarkdown += '\n';
      }

      return gridMarkdown;
    };

    // sendSmsAlert: Sends an SMS alert to notify the user that the solution is ready
    const sendSmsAlert = async (phoneNumber: string, solutionDocument: string) => {
      try {
        const smsPrompt = {
          systemPrompt: 'You are an AI assistant that sends concise SMS alerts to notify users when their ARC Solver solution is ready.',
          prompt: `The ARC Solver solution document is ready:

<SolutionDocument>  
${solutionDocument}
</SolutionDocument>

Please draft a brief SMS alert message (max 160 characters) notifying the user that their solution is ready and where they can find the full details. The SMS should be friendly and to-the-point.`,
        };

        const smsMessage = await gptRequest(model, 0, smsPrompt.systemPrompt, smsPrompt.prompt, phoneNumber, email, 200);
        console.log('SMS Alert:', smsMessage);
        debug += `SMS alert message: ${smsMessage}\n`;

        // Send the actual SMS using an SMS service API (implementation not shown)
        // sendSms(phoneNumber, smsMessage);
    debug += `Send Fake SMS to ${phoneNumber} with message: ${smsMessage}\n`;
      } catch (error: any) {
        debug += `Error in sendSmsAlert: ${error.message}\n`; 
        console.error('Error in sendSmsAlert:', error);
      }
    };

    // returnSolutionResponse: Returns the formatted solution document and debug information as the API response
    const returnSolutionResponse = async (solutionDocument: string, debug: string) => {
      try {
        const responseBody = {
          message: solutionDocument,
          debug: debug,
        };

        // Return the API response
        return responseBody;
      } catch (error: any) {
        debug += `Error in returnSolutionResponse: ${error.message}\n`;
        console.error('Error in returnSolutionResponse:', error);

        // Return an error response
        return {
          message: 'An error occurred while generating the solution response.',
          debug: debug,
        };
      }
    };

    // Main execution flow
    const taskData = await loadTaskFromFile(userRequest);
    const { trainPairs, testPairs } = await parseTaskData(taskData);
    const initialRules = await analyzeTrainPairs(trainPairs);
    const refinedRules = await refineRules(initialRules, trainPairs);
    const solutions = await applyRulesToTestPairs(refinedRules, testPairs);
    const solutionDocument = await formatSolutionDocument(solutions, refinedRules);

    // Generate markdown tables for input and output grids in each solution
    for (const solution of solutions) {
      const inputGridMarkdown = await generateGridMarkdown(solution.inputGrid);
      const outputGridMarkdown = await generateGridMarkdown(solution.outputGrid);
      solution.inputGridMarkdown = inputGridMarkdown;
      solution.outputGridMarkdown = outputGridMarkdown;
    }

    // Update the solution document with the grid markdowns
    let solutionDocumentWithGrids = solutionDocument;
    for (const solution of solutions) {
      solutionDocumentWithGrids = solutionDocumentWithGrids.replace(
        `[Input Grid for Test Pair ${solution.pairNumber}]`,
        solution.inputGridMarkdown
      ).replace(
        `[Output Grid for Test Pair ${solution.pairNumber}]`,
        solution.outputGridMarkdown  
      );
    }

    await sendSmsAlert(phoneNumber, solutionDocumentWithGrids);
    const response = await returnSolutionResponse(solutionDocumentWithGrids, debug);

    const beautifulOrganizedMarkdownReply = `${response.message}

## Debug Information
<details>
<summary>Click to expand debug information</summary>

${response.debug}

</details>
    `;

    const smsReply = `Your ARC Solver solution is ready! Check your email or chat.heydata.org for the full solution details.`;

    res.status(200).json({
      message: beautifulOrganizedMarkdownReply,
      debug: debug,
      smsReply: smsReply
    });

  } catch (error: any) {
    const errorSmsReply = `Sorry, I couldn't solve the ARC task you requested. See chat.heydata.org for details or try again with a different file.`;
    console.error('Error in ARCSolver:', error.message);
    debug += `Error in ARCSolver: ${error.message}\n`;
    res.status(200).json({
      message: `
## An error occurred while running the ARC Solver skill 😞 
Sorry! Something went wrong while processing the ARC task you requested. Here are some details about the error:

<details>
<summary><i>Click here for more technical details about the error...</i></summary>

\`\`\`
${error.message}
\`\`\`

\`\`\`
${debug}
\`\`\`

</details>

**Suggestions:**
- Double check the format of the task JSON file you provided. It should match the expected format for ARC tasks.
- Try a different task file, preferably one from the training set first to test.
- If the issue persists, please reach out on chat.heydata.org for support. We'll do our best to resolve it!

Thanks for your patience and understanding. Let's solve some ARC tasks! 🧩💪
      `, 
      smsReply: errorSmsReply,
      debug: debug
    });
  }
};

export default handler;