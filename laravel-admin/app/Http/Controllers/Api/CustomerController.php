<?php
// app/Http/Controllers/CustomerController.php
namespace App\Http\Controllers\api;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Services\CustomerService;
use Illuminate\Support\Facades\Storage;


class CustomerController extends Controller
{
    private CustomerService $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index()
    {
        return response()->json(
        $this->customerService->getCustomers()
       );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:customers',
            'phone' => 'nullable|string',
            'status'=> 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $customer = $this->customerService->create($validated);

        return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
    }

    public function show(Customer $customer)
    {
    return response()->json(
        $this->customerService->getCustomer($customer)
    );
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:customers,email,' . $customer->id,
            'phone'  => 'nullable|string',
            'status' => 'boolean',
            'image'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $customer = $this->customerService->update(
            $customer,
            $validated
        );

        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $customer
        ]);
    }

    public function destroy(Customer $customer)
    {
        $this->customerService->delete($customer);
        return response()->json(['message' => 'Customer deleted successfully']);
    }

    // Toggle status
    public function toggleStatus(Customer $customer)
    {
        $customer = $this->customerService->toggleStatus($customer);

        return response()->json(['message' => 'Status updated', 'status' => $customer->status]);
    }
}
