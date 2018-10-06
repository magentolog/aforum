<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    private function render($view) {
        $this->load->view('layout', array('view' => $view));
    }

    public function index() {
        $this->load->model('user_model');
        $data = array();
        $data['users'] = $this->user_model->getUserList();
        $view = $this->load->view('user_list', $data, TRUE);
        $this->render($view);
    }

    public function login() {
        $this->load->model('user_model');
        $data = array();
        if (!empty($this->input->post())) {
            // check user
            $email = $this->input->post('email');
            $password = $this->input->post('password');
            $user = $this->user_model->getUser($email, $password);
            if (empty($user)) {
                $data['message'] = 'email or password invalid';
            } else {
                // write info about user into session
                $this->session->set_userdata('user_id', $user['id']);
                $this->session->set_userdata('user_first_name', $user['first_name']);
                $this->session->set_userdata('user_last_name', $user['last_name']);
                //\\
                $data['message'] = 'hello ' . $user['first_name'] . '!';
            }
        }
        $view = $this->load->view('user_login', $data, TRUE);
        $this->render($view);
    }
    
    public function logout() {
        // remove info about user from session
        $this->session->unset_userdata('user_id');
        $this->session->unset_userdata('user_first_name');
        $this->session->unset_userdata('user_last_name');
        // redirect to main page                
        redirect(base_url());
    }

    public function register() {
        $this->load->model('user_model');
        $data = array();
        if (!empty($this->input->post())) {
            // check user
            $post = $this->input->post();
            $user = $this->user_model->addUser($post);
            if (empty($user)) {
                $data['message'] = 'please double check email and nickname';
            } else {
                $data['message'] = 'Congratulations! you are signed in, ' . $user['first_name'] . '!';
            }
        }
        $view = $this->load->view('user_register', $data, TRUE);
        $this->render($view);
    }

}
