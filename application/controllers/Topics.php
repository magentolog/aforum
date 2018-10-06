<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Topics extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function index() {
        $this->load->model('topic_model');        
        $data = array();
        $data['topics'] = $this->topic_model->getTopicList();
        $view = $this->load->view('topic_list', $data, TRUE);
        $this->load->view('layout', array('view' => $view));
    }

}
