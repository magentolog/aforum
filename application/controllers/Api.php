<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

    public function index() {

        $data['title'] = ucfirst('title');
        $data['users'] = array();

        $this->load->view('templates/header', $data);
        $this->load->view('user_list', $data);
        $this->load->view('templates/footer', $data);
    }

    function ajax($data) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Expires: Tue, 01 Jan 1980 1:00:00 GMT');
        echo json_encode($data);
    }

    public function users() {       
        $this->load->model('users_model');
        $data = $this->users_model->getUsers();
        $this->ajax($data);
    }
    
    public function locations() {
        $this->load->model('locations_model');
        $data = $this->locations_model->getAll();
        $this->ajax($data);        
    }

}
