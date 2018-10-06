<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Messages extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function show($topic_id) {
        $this->load->model('messages_model');        
        $data = array();
        $data['messages'] = $this->messages_model->getTopicMessages($topic_id);
        $view = $this->load->view('messages_list', $data, TRUE);
        $this->load->view('layout', array('view' => $view));
    }
}
